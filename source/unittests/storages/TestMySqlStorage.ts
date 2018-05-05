import * as assert from "assert";
import * as assertextentions from "../assertextentions"
import * as mysql from "mysql"
import { MysqlStorage } from "../../storages/MysqlStorage"
const config = require("../../../config/config");

var storage: MysqlStorage;

describe("storages/MysqlStorage", () =>
{
    before(async () =>
    {
        var createDummyTable: string = `
            CREATE TABLE dummy_test_table
            (
                ID   INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
                NAME VARCHAR(255) NOT NULL,
                AGE  INT          NOT NULL
            )
        `;
        var createDummyData: string = `
            INSERT INTO dummy_test_table (NAME, AGE) VALUES
            ("Mike", 1),
            ("Tony", 10),
            ("Johnny", 100),
            ("Elisa", 1000)
        `;
        storage = new MysqlStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);
        await storage.Initialize();
        await storage.QueryResultsOrNull(createDummyTable);
        await storage.QueryResultsOrNull(createDummyData);
    });

    describe("Initialize", () =>
    {
        it("Connect with wrong credentials throws ER_ACCESS_DENIED_ERROR", async () =>
        {
            await assertextentions.assertThrowsAsync(/ER_ACCESS_DENIED_ERROR/, async () =>
            {
                var storage: MysqlStorage = new MysqlStorage(config.db.host, config.db.dbname, "wrong_username", "password");
                await storage.Initialize();
            });
        });
    });

    describe("QueryResultsOrNull", () =>
    {
        it("Query with no results returns null", async () =>
        {
            var noResultsQuery: string = "SELECT * FROM dummy_test_table WHERE NAME = 'non-existent-name'";
            var results: Array<object> = await storage.QueryResultsOrNull(noResultsQuery);
            assert.equal(results, null);
        }),

        it("Query non-existent field returns null", async () =>
        {
            var nonExistentFieldQuery: string = "SELECT * FROM dummy_test_table WHERE NON_EXISTENT_FIELD = 'non-existent-name'";
            var results: Array<object> = await storage.QueryResultsOrNull(nonExistentFieldQuery);
            assert.equal(results, null);
        }),

        it("Valid query results length matches database", async () =>
        {
            var twoResultsQuery: string = "SELECT * FROM dummy_test_table WHERE AGE < 20";
            var results: Array<object> = await storage.QueryResultsOrNull(twoResultsQuery);
            assert.equal(results.length, 2);
        }),

        it("Invalid query returns null", async () =>
        {
            var invalidQuery: string = "once upon a time..";
            var results: Array<object> = await storage.QueryResultsOrNull(invalidQuery);
            assert.equal(results, null);
        });
    });

    describe("Write", () =>
    {
        it("Write new entry to table succeeds with valid object", async () =>
        {
            var validJson: object = {NAME: "Jennifer", AGE: "6"};
            var isSuccess: boolean = await storage.WriteSingle("dummy_test_table", validJson);
            assert.equal(isSuccess, true);
        }),

        it("Single new entry to table fails with invalid object", async () =>
        {
            var invalidJson: object = {NAME: "Jennifer", NON_EXISTENT_FIELD: "6"};
            var isSuccess: boolean = await storage.WriteSingle("dummy_test_table", invalidJson);
            assert.equal(isSuccess, false);
        });
    });

    after(async () =>
    {
        await storage.QueryResultsOrNull('DROP TABLE dummy_test_table');
        storage.Dispose();
    });
});
