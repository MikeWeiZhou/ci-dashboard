import * as express from "express"
import * as fs from "fs"
import { IDataStorage } from "../datastorages/IDataStorage"
import { IKpiState } from "../kpimappers/IKpiState"
const kpis = require("../../config/kpis")
const config = require("../../config/config")

export function start_webserver(storage: IDataStorage): void
{
    console.log("\n\nStarting Web Server...");
    const webServer: express.Express = express();

    // Route index
    webServer.get("/", (request: express.Request, response: express.Response) =>
    {
        response.sendFile(config.webserver.public_directory + "/index.html");
    });

    // Route everything to React, minus paths starting with "/getkpi"
    webServer.get(/^(?!\/getkpi)[\w.=/-]*/, (request: express.Request, response: express.Response) =>
    {
        if (fs.existsSync(config.webserver.public_directory + request.path))
        {
            response.sendFile(config.webserver.public_directory + request.path);
        }
        else
        {
            response.status(config.webserver.response.no_exists).send("File not found");
        }
    });

    // Get KPI
    webServer.get("/getkpi/:category/:kpi/:from/:to", async (request: express.Request, response: express.Response) =>
    {
        if (!kpis.list[request.params.category] || !kpis.list[request.params.category][request.params.kpi])
        {
            response.status(config.webserver.response.no_exists).send(`${request.params.kpi}: Non-existent KPI`);
            return;
        }

        try
        {
            var kpi: IKpiState|null = await kpis.list[request.params.category][request.params.kpi]
                .GetKpiStateOrNull(new Date(request.params.from), new Date(request.params.to));

            if (kpi != null)
            {
                response.status(config.webserver.response.ok).send(kpi);
            }
            else
            {
                response.status(config.webserver.response.no_data)
                    .send(`${kpis.list[request.params.category][request.params.kpi].Title}: No data for KPI`);
            }
        }
        catch (err)
        {
            err.name = `${kpis.list[request.params.category][request.params.kpi].Title}: ${err.name}`;
            response.status(config.webserver.response.error).send(err);
        }
    });

    // Get KPI Categories
    webServer.get("/getkpicategories", (request: express.Request, response: express.Response) =>
    {
        response.send(Object.keys(kpis.list));
    });

    // Get KPI Category Details
    webServer.get("/getkpicategorydetails/:category", (request: express.Request, response: express.Response) =>
    {
        if (!kpis.list[request.params.category])
        {
            response.status(config.webserver.response.no_exists).send("Non-existent KPI category");
            return;
        }

        response.send
        ({
            title: kpis.category[request.params.category],
            kpis: Object.keys(kpis.list[request.params.category])
        });
    });

    // Initialize all KPIs
    for (let cat of Object.keys(kpis.list))
    {
        for (let kpi of Object.keys(kpis.list[cat]))
        {
            kpis.list[cat][kpi].SetDataStorage(storage);
        }
    }

    // Start listening
    webServer.listen(config.webserver.port, () =>
    {
        console.log(`Web Server listening on port ${config.webserver.port}`);
    });
}