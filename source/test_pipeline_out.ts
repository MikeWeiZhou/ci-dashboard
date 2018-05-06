/**
 * Example of reading data from MySQL database
 * then mapping and returning a IKpiState object (contains all required information for Plotly.js)
 */

import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"
import { IKpiState } from "./kpimappers/IKpiState";
import { KpiMapper } from "./kpimappers/KpiMapper"
import { QaOverallBuildSuccessKpiMapper } from "./kpimappers/QaOverallBuildSuccessKpiMapper"
const config = require("../config/config")

var storage: MysqlDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

RunThroughPipeline();
async function RunThroughPipeline()
{
    console.log("Running pipeline from database -> kpi mapper...");
    console.log("If completed successfully, no errors would be thrown and Node.js will exit after completion.");

    console.log("Connecting to MySQL database...");
    await storage.Initialize();

    console.log("Reading from database and converting to KPI");
    var kpi: IKpiState|null = await ReadStorageAndConvertToKpi();
    console.log("KPI received:");
    console.log(kpi);

    storage.Dispose();
}

async function ReadStorageAndConvertToKpi(): Promise<IKpiState|null>
{
    var kpi: KpiMapper = new QaOverallBuildSuccessKpiMapper(storage);
    return await kpi.GetKpiStateOrNull(new Date("2018-01-25"), new Date("2018-10-25"));
}