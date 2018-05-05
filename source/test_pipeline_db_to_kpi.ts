/**
 * Example of reading data from MySQL database
 * then mapping and returning a IKpiState object (contains all required information for Plotly.js)
 */

import { IStorage } from "./storages/IStorage"
import { MysqlStorage } from "./storages/MysqlStorage"
import { IKpiState } from "./kpimappers/IKpiState";
import { KpiMapper } from "./kpimappers/KpiMapper"
import { QaOverallBuildSuccessKpiMapper } from "./kpimappers/QaOverallBuildSuccessKpiMapper"

const config = require("../config/config")

var storage: MysqlStorage = new MysqlStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

RunThroughPipeline();

async function RunThroughPipeline()
{
    console.log("Running pipeline from database -> kpi mapper...");

    await storage.Initialize();
    await ReadStorageAndConvertToKpi();

    storage.Dispose();
}

async function ReadStorageAndConvertToKpi()
{
    var kpi: KpiMapper = new QaOverallBuildSuccessKpiMapper(storage);
    var kpistate: IKpiState|null = await kpi.GetKpiStateOrNull(new Date("2018-01-25"), new Date("2018-10-25"));
    console.log("\nKPI State mapped:");
    console.log(kpistate);
    console.log("\nFinished successfully.");
}