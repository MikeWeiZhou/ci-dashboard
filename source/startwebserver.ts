import * as express from "express"
import * as fs from "fs"
import { IDataStorage } from "./datastorages/IDataStorage"
import { IKpiState } from "./kpimappers/IKpiState"
import { QaOverallBuildSuccessKpiMapper } from "./kpimappers/QaOverallBuildSuccessKpiMapper"
const config = require("../config/config")

export async function startwebserver(storage: IDataStorage): Promise<void>
{
    console.log("Starting Web Server...");
    const webServer: express.Express = express();
    const path: string = config.var.basedir + "/build/react";

    // List of all KPIs. Category : KPI
    const kpis: any =
    {
        qa:
        {
            overall_builds_success: new QaOverallBuildSuccessKpiMapper(storage)
        }
    };

    // Route index
    webServer.get("/", (request: express.Request, response: express.Response) =>
    {
        response.sendFile(path + "/index.html");
    });

    // Route everything minus paths starting with "/kpi" to front-end folder
    webServer.get(/^(?!\/kpi)[\w.=/-]*/, (request: express.Request, response: express.Response) =>
    {
        if (fs.existsSync(path + request.path))
        {
            response.sendFile(path + request.path);
        }
        else
        {
            response.status(404).send("Not found");
        }
    });

    // Route things starting with "/kpi"
    webServer.get("/kpi/:category/:kpi/:from/:to", (request: express.Request, response: express.Response) =>
    {
        if (kpis[request.params.category] && kpis[request.params.category][request.params.kpi])
        {
            kpis[request.params.category][request.params.kpi]
                .GetKpiStateOrNull(new Date(request.params.from), new Date(request.params.to))
                .then((results: IKpiState|null) =>
                {
                    if (results != null)
                    {
                        response.send(results);
                    }
                    else
                    {
                        response.status(404).send("Non-existent KPI");
                    }
                })
                .catch((err: Error) =>
                {
                    response.status(500).send(err);
                });
        }
        else
        {
            response.status(400).send("Invalid request");
        }
    });

    // Start listening
    webServer.listen(config.webserver.port, () =>
    {
        console.log(`Rest API listening on port ${config.webserver.port}`);
    });
}