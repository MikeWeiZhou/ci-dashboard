import * as express from "express"
import * as fs from "fs"
import { IDataStorage } from "../datastorages/IDataStorage"
import { IKpiState } from "../kpimappers/IKpiState"
import { QaOverallBuildSuccessKpiMapper } from "../kpimappers/QaOverallBuildSuccessKpiMapper"
import { QaBuildSuccessPerPlatformPerProductKpiMapper } from "../kpimappers/QaBuildSuccessPerPlatformPerProductKpiMapper"
import { QaBuildSuccessPerPlatformKpiMapper } from "../kpimappers/QaBuildSuccessPerPlatformKpiMapper"
import { QaBuildSuccessPerProductKpiMapper} from "../kpimappers/QaBuildSuccessPerProductKpiMapper"
import { BuildSuccessRateKpiMapper} from "../kpimappers/BuildSuccessRateKpiMapper"
import { DefectsMajorCreatedResolvedKpiMapper } from "../kpimappers/DefectsMajorCreatedResolvedKpiMapper"
import { DefectsCriticalCreatedResolvedKpiMapper } from "../kpimappers/DefectsCriticalCreatedResolvedKpiMapper"
import { DefectsTotalNumberOfBugsKpiMapper } from "../kpimappers/DefectsTotalNumberOfBugsKpiMapper"
import { StoryPointsVelocityKpiMapper } from "../kpimappers/StoryPointsVelocityKpiMapper"


const config = require("../../config/config")

export function start_webserver(storage: IDataStorage): void
{
    console.log("\n\nStarting Web Server...");
    const webServer: express.Express = express();

    // List of all KPI Mappers
    // Category : KPIMapper
    const kpis: any =
    {
        // Add mappers here
        defects:
        {
            major_defects_created: new DefectsMajorCreatedResolvedKpiMapper(storage),
            critical_defects_created: new DefectsCriticalCreatedResolvedKpiMapper(storage),
            total_defects: new DefectsTotalNumberOfBugsKpiMapper(storage)
        },
        dev:
        {
            story_points_velocity: new StoryPointsVelocityKpiMapper(storage)
        },
        qa:
        {
            overall_builds_success: new QaOverallBuildSuccessKpiMapper(storage),
            build_success_rate_per_platform_per_product: new QaBuildSuccessPerPlatformPerProductKpiMapper(storage),
            build_success_rate_per_platform : new QaBuildSuccessPerPlatformKpiMapper(storage),
            build_success_rate_per_product: new QaBuildSuccessPerProductKpiMapper(storage),
            build_success_rate: new BuildSuccessRateKpiMapper(storage)
        }
    };

    // Route index
    webServer.get("/", (request: express.Request, response: express.Response) =>
    {
        response.sendFile(config.webserver.public_directory + "/index.html");
    });

    // Route everything to React, minus paths starting with "/kpi"
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

    // KPI REST API
    webServer.get("/getkpi/:category/:kpi/:from/:to", (request: express.Request, response: express.Response) =>
    {
        if (kpis[request.params.category] && kpis[request.params.category][request.params.kpi])
        {
            kpis[request.params.category][request.params.kpi]
                .GetKpiStateOrNull(new Date(request.params.from), new Date(request.params.to))
                .then((results: IKpiState|null) =>
                {
                    if (results != null)
                    {
                        response.status(config.webserver.response.ok).send(results);
                    }
                    else
                    {
                        response.status(config.webserver.response.no_data).send("No data for KPI");
                    }
                })
                .catch((err: Error) =>
                {
                    response.status(config.webserver.response.error).send(err);
                });
        }
        else
        {
            response.status(config.webserver.response.no_exists).send("Non-existent KPI");
        }
    });

    // Get KPI Categories
    webServer.get("/getkpicategories", (request: express.Request, response: express.Response) =>
    {
        response.send(Object.keys(kpis));
    });

    // Get KPI Categories
    webServer.get("/getkpicategorydetails/:category", (request: express.Request, response: express.Response) =>
    {
        if (kpis[request.params.category])
        {
            response.send
            ({
                title: request.params.category,
                kpis: Object.keys(kpis[request.params.category])
            });
        }
        else
        {
            response.status(config.webserver.response.no_exists).send("Non-existent KPI category");
        }
    });

    // Start listening
    webServer.listen(config.webserver.port, () =>
    {
        console.log(`Web Server listening on port ${config.webserver.port}`);
    });
}