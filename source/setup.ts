import { IDataStorage } from "./datastorages/IDataStorage"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"
const config = require("../config/config")

const storage: IDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

SetupDatabase();

async function SetupDatabase()
{
    console.log("Setting up database...");
    await storage.Initialize();

    for (let i: number = 0; i < Queries.length; ++i)
    {
        console.log(await storage.Query(Queries[i]));
    }

    storage.Dispose();
    console.log("Completed database setup.");
}

var Queries: string[] =
[
    `
        CREATE TABLE IF NOT EXISTS ${config.db.tablenames.data_models_tracker}
        (
            TABLE_NAME  VARCHAR(255)    PRIMARY KEY NOT NULL,
            FROM_DATE   DATETIME        NOT NULL,
            TO_DATE     DATETIME        NOT NULL
        )
    `
];