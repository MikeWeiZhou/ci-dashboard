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

    describe(".Initialize", () =>
    {
        it("should throw ER_ACCESS_DENIED_ERROR with wrong credentials", async () =>
        {
            await assertextentions.assertThrowsAsync(/ER_ACCESS_DENIED_ERROR/, async () =>
            {
                var storage: MysqlStorage = new MysqlStorage(config.db.host, config.db.dbname, "wrong_username", "password");
                await storage.Initialize();
            });
        });
    });

    describe(".QueryResultsOrNull", () =>
    {
        it("should return null for query with zero results", async () =>
        {
            var noResultsQuery: string = "SELECT * FROM dummy_test_table WHERE NAME = 'non-existent-name'";
            var results: Array<object> = await storage.QueryResultsOrNull(noResultsQuery);
            assert.equal(results, null);
        }),

        it("should return null when selecting non-existent field", async () =>
        {
            var nonExistentFieldQuery: string = "SELECT * FROM dummy_test_table WHERE NON_EXISTENT_FIELD = 'non-existent-name'";
            var results: Array<object> = await storage.QueryResultsOrNull(nonExistentFieldQuery);
            assert.equal(results, null);
        }),

        it("should return null on invalid query", async () =>
        {
            var invalidQuery: string = "once upon a time..";
            var results: Array<object> = await storage.QueryResultsOrNull(invalidQuery);
            assert.equal(results, null);
        }),

        it("query results length should match the database data", async () =>
        {
            var twoResultsQuery: string = "SELECT * FROM dummy_test_table WHERE AGE < 20";
            var results: Array<object> = await storage.QueryResultsOrNull(twoResultsQuery);
            assert.equal(results.length, 2);
        });
    });

    describe(".Write", () =>
    {
        it("should return true and data saved when writing single valid data set to database", async () =>
        {
            var keys: Array<any> = ["NAME", "AGE"];
            var data: Array<any> = ["Jennifer", 6];
            var isSuccess: boolean = await storage.Write("dummy_test_table", keys, data);
            assert.equal(isSuccess, true);

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'Jennifer' AND AGE = 6";
            var results: Array<object> = await storage.QueryResultsOrNull(query);
            assert.equal(results.length, 1);
        }),

        it("should return true and data saved when writing multiple valid data sets to database", async () =>
        {
            var keys: Array<any> = ["NAME", "AGE"];
            var data: Array<any> = [["BigTommy", 99], ["BigTommy", 15]];
            var isSuccess: boolean = await storage.Write("dummy_test_table", keys, data);
            assert.equal(isSuccess, true);

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'BigTommy' AND AGE = 99";
            var results: Array<object> = await storage.QueryResultsOrNull(query);
            assert.equal(results.length, 1);

            query = "SELECT * FROM dummy_test_table WHERE NAME = 'BigTommy' AND AGE = 15";
            results = await storage.QueryResultsOrNull(query);
            assert.equal(results.length, 1);
        }),

        it("should return false and data not saved when writing invalid data/key to database", async () =>
        {
            var keys: Array<any> = ["NAME", "AGE"];
            var data: Array<any> = ["BigBlooper1", "string"];
            var isSuccess: boolean = await storage.Write("dummy_test_table", keys, data);
            assert.equal(isSuccess, false);

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'BigBlooper1'";
            var results: Array<object> = await storage.QueryResultsOrNull(query);
            assert.equal(results, null);
        }),

        it("should return false and data not saved when writing invalid data/key to database", async () =>
        {
            var keys: Array<any> = ["NAME", "NON_EXISTENT_FIELD"];
            var data: Array<any> = ["BigBlooper2", 6];
            var isSuccess: boolean = await storage.Write("dummy_test_table", keys, data);
            assert.equal(isSuccess, false);

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'BigBlooper2'";
            var results: Array<object> = await storage.QueryResultsOrNull(query);
            assert.equal(results, null);
        });
    });

    after(async () =>
    {
        await storage.QueryResultsOrNull('DROP TABLE dummy_test_table');
        storage.Dispose();
    });
});