/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import IDataReader from "./datareaders/IDataReader"
import JsonDataReader from "./datareaders/JsonDataReader"

import IDataTransformer from "./datatransformers/IDataTransformer"
import QaBuildsAndRunsFromBambooDataTransformer from "./datatransformers/QaBuildsAndRunsFromBambooDataTransformer"

import IStorage from "./storages/IStorage";
import MySqlStorage from "./storages/MySqlStorage";

import IKpi from "./kpis/IKpi"
import QaOverallBuildSuccessKpi from "./kpis/QaOverallBuildSuccessKpi"
import QaBuildSuccessPerPlatform from "./kpis/QaBuildSuccessPerPlatform"

import TransformStream from "./TransformStream"
import WriteStream from "./WriteStream";

const storage: IStorage = new MySqlStorage("localhost", "cidashboard", "root", "");

RunThroughPipeline();

async function RunThroughPipeline()
{
    await storage.Initialize();

    // await CreateTable();
    // await ReadTransformAndSaveData();
    await ReadStorageAndConvertToKpi();

    storage.Dispose();
}

async function CreateTable()
{
    return new Promise(async (resolve, reject) =>
    {
        console.log("Re-creating table...");
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
        console.log("Finished creating table.");
        resolve();
    });
}

async function ReadTransformAndSaveData()
{
    return new Promise((resolve, reject) =>
    {
        console.log("Reading, transforming, and saving data...");
        const dataReader: IDataReader = new JsonDataReader("./data/qa_builds_and_runs_from_bamboo.json", "*");
        const dataTransformer: IDataTransformer = new QaBuildsAndRunsFromBambooDataTransformer();
        dataReader.Initialize();

        const stream = dataReader.GetStream();
        stream
            .pipe(new TransformStream(dataTransformer))
            .pipe(new WriteStream(storage))
            .on('end', () => {
                dataReader.Dispose();
                console.log("Read, transformed, and saved data.");
                resolve();
            })
            .on('error', (err: any) => {
                console.log(err);
            });
    });
}

async function ReadStorageAndConvertToKpi(): Promise<any>
{
    return new Promise((resolve, reject) =>
    {
        console.log("Reading and converting storage data to KPI...");
        // const kpi: IKpi = new QaOverallBuildSuccessKpi();
        const kpi: IKpi = new QaBuildSuccessPerPlatform();
        kpi.GetPlotlyState();
        console.log("Finished reading and converting storage data to KPI.");
        resolve();
    });
}