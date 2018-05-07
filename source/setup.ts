/**
 * This setup file should run when calling: "npm run setup"
 * So there is no need to manually run this file.
 * 
 * This will set up the required database tables for tracking.
 */

import * as moment from "moment"
import { IDataStorage } from "./datastorages/IDataStorage"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"
const config = require("../config/config")

const storage: IDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

SetupDatabase();

async function SetupDatabase()
{
    var starting_data_date = moment.utc(config.scheduler.starting_data_date).format(config.dateformat.mysql);

    // Ensure queries are able to run multiple times and not mess up existing database,
    // as users might erroneously call "npm run setup" multiple times
    var Queries: string[] =
    [
        // Creates table to keep track of different data sources
        `CREATE TABLE IF NOT EXISTS ${config.db.tablename.data_source_tracker}
        (
            TABLE_NAME  VARCHAR(255)    PRIMARY KEY NOT NULL,
            FROM_DATE   DATETIME        NOT NULL,
            TO_DATE     DATETIME        NOT NULL
        )`,

        // Create table to model QaBuildsAndRunsFromBambooDataInterface
        `CREATE TABLE IF NOT EXISTS ${config.db.tablename.qa_builds_and_runs_from_bamboo}
        (
            BUILDRESULTSUMMARY_ID           INT             PRIMARY KEY NOT NULL,
            MINUTES_TOTAL_QUEUE_AND_BUILD   INT             NOT NULL,
            BUILD_COMPLETED_DATE            DATETIME        NOT NULL,
            CYCLE                           CHAR(6)         NOT NULL,
            PLATFORM                        CHAR(3)         NOT NULL,
            PRODUCT                         CHAR(2)         NOT NULL,
            IS_DEFAULT                      TINYINT(1)      NOT NULL,
            IS_SUCCESS                      TINYINT(1)      NOT NULL,
            BRANCH_ID                       INT             NOT NULL
        )`,
        // Add model QaBuildsAndRunsFromBambooDataInterface to tracking table
        `INSERT IGNORE INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME, FROM_DATE, TO_DATE)
        VALUES ('${config.db.tablename.qa_builds_and_runs_from_bamboo}', '${starting_data_date}', '${starting_data_date}')`
    ];

    console.log("Setting up database...");
    console.log("Connecting to database...");
    await storage.Initialize();
    for (let i: number = 0; i < Queries.length; ++i)
    {
        try
        {
            console.log(i + ". Running database query...");
            await storage.Query(Queries[i]);
        }
        catch (err)
        {
            console.log("ERROR RUNNING QUERY: " + Queries[i]);
            throw err;
        }
    }
    console.log("Closing database connection...");
    storage.Dispose();
    console.log("Completed database setup.");
}