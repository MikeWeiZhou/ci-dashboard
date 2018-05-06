// import * as mysql from "mysql"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"
const config = require("../config/config");

var storage: MysqlDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);

storage.Query(`
    CREATE TABLE dummy_test_table
    (
        ID   INT          NOT NULL PRIMARY KEY,
        NAME VARCHAR(255) NOT NULL,
        AGE  INT          NOT NULL
    )
`);

storage.Query(`
    INSERT INTO dummy_test_table (NAME, AGE) VALUES
    ("Mike", 1),
    ("Tony", 10),
    ("Johnny", 100),
    ("Elisa", 1000)
`);