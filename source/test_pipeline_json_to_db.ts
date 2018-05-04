/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import IDataReader from "./datareaders/IDataReader"
import JsonDataReader from "./datareaders/JsonDataReader"

import IDataTransformer from "./datatransformers/IDataTransformer"
import QaBuildsAndRunsFromBambooDataTransformer from "./datatransformers/QaBuildsAndRunsFromBambooDataTransformer"

import IStorage from "./storages/IStorage"
import MySqlStorage from "./storages/MySqlStorage"

// import IKpi from "./kpis/IKpi"
// import QaOverallBuildSuccessKpi from "./kpis/QaOverallBuildSuccessKpi"
// import QaBuildSuccessPerPlatform from "./kpis/QaBuildSuccessPerPlatform"

import TransformStream from "./TransformStream"
import WriteStream from "./WriteStream"

const config = require("../config/config")

const storage: IStorage = new MySqlStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

RunThroughPipeline();

async function RunThroughPipeline()
{
    console.log("Running pipeline from datareader -> datatransformer -> storage.");
    console.log("If completed successfully, no errors would be thrown and Node.js will exit after completion.");

    await storage.Initialize();

    await CreateTable();
    await ReadTransformAndSaveData();
    // await ReadStorageAndConvertToKpi();

    storage.Dispose();
}

async function CreateTable()
{
    return new Promise(async (resolve, reject) =>
    {
        await storage.QueryOrNull("DROP TABLE IF EXISTS qa_builds_and_runs_from_bamboo");
        await storage.QueryOrNull
        (`
            CREATE TABLE qa_builds_and_runs_from_bamboo
            (
                MINUTES_TOTAL_QUEUE_AND_BUILD   INT,
                BUILD_COMPLETED_DATE            DATETIME,
                PLATFORM                        CHAR(3),
                PRODUCT                         CHAR(2),
                IS_MASTER                       TINYINT(1),
                IS_SUCCESS                      TINYINT(1)
            )
        `);
        resolve();
    });
}

async function ReadTransformAndSaveData()
{
    return new Promise((resolve, reject) =>
    {
        const dataReader: IDataReader = new JsonDataReader("./data/qa_builds_and_runs_from_bamboo.json", "*");
        const dataTransformer: IDataTransformer = new QaBuildsAndRunsFromBambooDataTransformer();
        dataReader.Initialize();
        dataReader.GetStream()
            .pipe(new TransformStream(dataTransformer))
            .pipe(new WriteStream(storage))
            .on('finish', () => {
                dataReader.Dispose();
                resolve();
            });
    });
}

// async function ReadStorageAndConvertToKpi(): Promise<any>
// {
//     return new Promise((resolve, reject) =>
//     {
//         console.log("Reading and converting storage data to KPI...");
//         // const kpi: IKpi = new QaOverallBuildSuccessKpi();
//         const kpi: IKpi = new QaBuildSuccessPerPlatform();
//         kpi.GetPlotlyState();
//         console.log("Finished reading and converting storage data to KPI.");
//         resolve();
//     });
// }