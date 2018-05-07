/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import { IDataCollector } from "./datacollectors/IDataCollector"
import { JsonDataCollector } from "./datacollectors/JsonDataCollector"
import { PythonShellJsonDataCollector } from "./datacollectors/PythonShellJsonDataCollector"
import { IDataInterface } from "./datainterfaces/IDataInterface"
import { QaBuildsAndRunsFromBambooDataInterface } from "./datainterfaces/QaBuildsAndRunsFromBambooDataInterface"
import { IDataStorage } from "./datastorages/IDataStorage"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"
import { TransformStream } from "./datainterfaces/TransformStream"
import { WriteStream } from "./datastorages/WriteStream"
const config = require("../config/config")

const storage: IDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

RunThroughPipeline();
async function RunThroughPipeline()
{
    console.log("Running pipeline from datareader -> datatransformer -> storage.");
    console.log("If completed successfully, no errors would be thrown and Node.js will exit after completion.");

    const dataReaderFromJsonFile: IDataCollector = new JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json", "*");
    const dataReaderFromPythonScript: IDataCollector = new PythonShellJsonDataCollector("./data/test_print_json.py", "*");

    console.log("Connecting to MySQL database...");
    await storage.Initialize();

    console.log("Deleting and recreating table...");
    await CreateTable();

    console.log("Getting data from python script and saving to database");
    await ReadTransformAndSaveData(dataReaderFromPythonScript);

    console.log("Getting data from JSON file and saving to database");
    await ReadTransformAndSaveData(dataReaderFromJsonFile);

    storage.Dispose();
    console.log("Finished pipeline-in test.");
}

async function CreateTable()
{
    return new Promise(async (resolve, reject) =>
    {
        await storage.Query(`DROP TABLE IF EXISTS ${config.db.tablenames.qa_builds_and_runs_from_bamboo}`);
        await storage.Query
        (`
            CREATE TABLE ${config.db.tablenames.qa_builds_and_runs_from_bamboo}
            (
                MINUTES_TOTAL_QUEUE_AND_BUILD   INT             NOT NULL,
                BUILD_COMPLETED_DATE            DATETIME        NOT NULL,
                CYCLE                           CHAR(6)         NOT NULL,
                PLATFORM                        CHAR(3)         NOT NULL,
                PRODUCT                         CHAR(2)         NOT NULL,
                IS_DEFAULT                      TINYINT(1)      NOT NULL,
                IS_SUCCESS                      TINYINT(1)      NOT NULL,
                BRANCH_ID                       INT             NOT NULL
            )
        `);
        resolve();
    });
}

async function ReadTransformAndSaveData(dataReader: IDataCollector)
{
    return new Promise((resolve, reject) =>
    {
        const dataInterface: IDataInterface = new QaBuildsAndRunsFromBambooDataInterface();
        dataReader.Initialize(new Date("2015-01-10"), new Date("2019-01-10"));
        dataReader.GetStream()
            .pipe(new TransformStream(dataInterface))
            .pipe(new WriteStream(storage, dataInterface))
            .on('finish', () => {
                dataReader.Dispose();
                resolve();
            });
    });
}