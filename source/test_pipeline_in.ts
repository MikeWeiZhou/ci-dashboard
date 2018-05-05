/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import { IDataReader } from "./datareaders/IDataReader"
import { JsonDataReader } from "./datareaders/JsonDataReader"
import { PythonShellJsonDataReader } from "./datareaders/PythonShellJsonDataReader"
import { IDataTransformer } from "./datatransformers/IDataTransformer"
import { QaBuildsAndRunsFromBambooDataTransformer } from "./datatransformers/QaBuildsAndRunsFromBambooDataTransformer"
import { IStorage } from "./storages/IStorage"
import { MysqlStorage } from "./storages/MysqlStorage"
import { TransformStream } from "./TransformStream"
import { WriteStream } from "./WriteStream"
const config = require("../config/config")

const storage: IStorage = new MysqlStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

RunThroughPipeline();
async function RunThroughPipeline()
{
    console.log("Running pipeline from datareader -> datatransformer -> storage.");
    console.log("If completed successfully, no errors would be thrown and Node.js will exit after completion.");

    const dataReaderFromJsonFile: IDataReader = new JsonDataReader("./data/qa_builds_and_runs_from_bamboo.json", "*");
    const dataReaderFromPythonScript: IDataReader = new PythonShellJsonDataReader("./data/test_print_json.py", "*");

    console.log("Connecting to MySQL database...");
    await storage.Initialize();

    console.log("Deleting and recreating table...");
    await CreateTable();

    console.log("Getting data from python script and saving to database");
    await ReadTransformAndSaveData(dataReaderFromPythonScript);

    console.log("Getting data from JSON file and saving to database");
    await ReadTransformAndSaveData(dataReaderFromJsonFile);

    storage.Dispose();
}

async function CreateTable()
{
    return new Promise(async (resolve, reject) =>
    {
        await storage.QueryResultsOrNull(`DROP TABLE IF EXISTS ${config.db.tablenames.qa_builds_and_runs_from_bamboo}`);
        await storage.QueryResultsOrNull
        (`
            CREATE TABLE ${config.db.tablenames.qa_builds_and_runs_from_bamboo}
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

async function ReadTransformAndSaveData(dataReader: IDataReader)
{
    return new Promise((resolve, reject) =>
    {
        const dataTransformer: IDataTransformer = new QaBuildsAndRunsFromBambooDataTransformer();
        dataReader.Initialize();
        dataReader.GetStream()
            .pipe(new TransformStream(dataTransformer))
            .pipe(new WriteStream(storage, dataTransformer))
            .on('finish', () => {
                dataReader.Dispose();
                resolve();
            });
    });
}