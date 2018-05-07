import { IDataStorage } from "./datastorages/IDataStorage"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"

import { startscheduler } from "./startscheduler"
const config = require("../config/config")

startserver();
async function startserver()
{
    const storage: IDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

    await storage.Initialize();
    await startscheduler(storage);
}