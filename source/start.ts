import { IDataStorage } from "./datastorages/IDataStorage"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"

import { startwebserver } from "./startwebserver"
import { startscheduler } from "./startscheduler"
const config = require("../config/config")

startservices();
async function startservices()
{
    console.log("Starting services...");

    const storage: IDataStorage = new MysqlDataStorage(config.db.connection);
    await storage.Initialize();

    startwebserver(storage);
    await startscheduler(storage);
}