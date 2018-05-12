import * as express from "express"
import * as fs from "fs"
import { IDataStorage } from "../datastorages/IDataStorage"
import { IKpiState } from "../kpimappers/IKpiState"
const config = require("../../config/config")

export function start_webserver(storage: IDataStorage): void
{
    console.log("\n\nStarting Web Server...");
    const webServer: express.Express = express();
    const kpilist: object = initializeKpisAndReturnList(storage);

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
        if (!kpilist[request.params.category] || !kpilist[request.params.category][request.params.kpi])
        {
            console.log(`non existent kpi: ${request.params.category}/${request.params.kpi}`);
            response.status(config.webserver.response.no_exists).send(`${request.params.kpi}: Non-existent KPI`);
            return;
        }

        try
        {
            var kpi: IKpiState|null = await kpilist[request.params.category][request.params.kpi]
                .GetKpiStateOrNull(new Date(request.params.from), new Date(request.params.to));

            if (kpi != null)
            {
                response.status(config.webserver.response.ok).send(kpi);
            }
            else
            {
                response.status(config.webserver.response.no_data)
                    .send(`${kpilist[request.params.category][request.params.kpi].Title}: No data for KPI`);
            }
        }
        catch (err)
        {
            err.name = `${kpilist[request.params.category][request.params.kpi].Title}: ${err.name}`;
            response.status(config.webserver.response.error).send(err);
        }
    });

    // Get KPI Categories
    webServer.get("/getkpicategories", (request: express.Request, response: express.Response) =>
    {
        response.send(Object.keys(kpilist));
    });

    // Get KPI Category Details
    webServer.get("/getkpicategorydetails/:category", (request: express.Request, response: express.Response) =>
    {
        if (!kpilist[request.params.category])
        {
            response.status(config.webserver.response.no_exists).send("Non-existent KPI category");
            return;
        }

        response.send
        ({
            title: request.params.category.replace('_', ' '),
            kpis: Object.keys(kpilist[request.params.category])
        });
    });

    // Start listening
    webServer.listen(config.webserver.port, () =>
    {
        console.log(`Web Server listening on port ${config.webserver.port}`);
    });
}

function initializeKpisAndReturnList(storage: IDataStorage)
{
    var kpilist: object = {};
    var dirs: string[] = fs.readdirSync("./source/kpimappers");
    for (let dirname of dirs)
    {
        if (/\.ts$/.test(dirname))
        {
            continue;
        }

        kpilist[dirname] = {};
        let kpifilenames: string[] = fs.readdirSync(`./source/kpimappers/${dirname}`);
        for (let filename of kpifilenames)
        {
            if (!/KpiMapper\.ts$/.test(filename))
            {
                continue;
            }

            let name: string = filename.replace(".ts", '');
            let apiName: string = filename.replace("KpiMapper.ts", '');
            let req = require(`../kpimappers/${dirname}/${name}`);
            kpilist[dirname][apiName] = new req[name](storage);
        }
    }

    return kpilist;
}