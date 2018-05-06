import * as assert from "assert";
import * as assertextentions from "../assertextentions"
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
        await storage.Query(createDummyTable);
        await storage.Query(createDummyData);
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

    describe(".Query", () =>
    {
        it("should return empty array for select query with zero results", async () =>
        {
            var noResultsQuery: string = "SELECT * FROM dummy_test_table WHERE NAME = 'non-existent-name'";
            var results: Array<object> = await storage.Query(noResultsQuery);
            assert.equal(results.length, 0);
        }),

        it("should throw ER_BAD_FIELD_ERROR non-existent field", async () =>
        {
            await assertextentions.assertThrowsAsync(/ER_BAD_FIELD_ERROR/, async () =>
            {
                var nonExistentFieldQuery: string = "SELECT * FROM dummy_test_table WHERE NON_EXISTENT_FIELD = 'non-existent-name'";
                await storage.Query(nonExistentFieldQuery);
            });
        }),

        it("should throw ER_PARSE_ERROR on invalid query", async () =>
        {
            await assertextentions.assertThrowsAsync(/ER_PARSE_ERROR/, async () =>
            {
                var invalidQuery: string = "once upon a time..";
                await storage.Query(invalidQuery);
            });
        }),

        it("query results length should match the database data", async () =>
        {
            var twoResultsQuery: string = "SELECT * FROM dummy_test_table WHERE AGE < 20";
            var results: Array<object> = await storage.Query(twoResultsQuery);
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
            var results: Array<object> = await storage.Query(query);
            assert.equal(results.length, 1);
        }),

        it("should return true and data saved when writing multiple valid data sets to database", async () =>
        {
            var keys: Array<any> = ["NAME", "AGE"];
            var data: Array<any> = [["BigTommy", 99], ["BigTommy", 15]];
            var isSuccess: boolean = await storage.Write("dummy_test_table", keys, data);
            assert.equal(isSuccess, true);

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'BigTommy' AND AGE = 99";
            var results: Array<object> = await storage.Query(query);
            assert.equal(results.length, 1);

            query = "SELECT * FROM dummy_test_table WHERE NAME = 'BigTommy' AND AGE = 15";
            results = await storage.Query(query);
            assert.equal(results.length, 1);
        }),

        it("should throw ER_TRUNCATED_WRONG_VALUE_FOR_FIELD and data not saved when writing invalid data to database", async () =>
        {
            await assertextentions.assertThrowsAsync(/ER_TRUNCATED_WRONG_VALUE_FOR_FIELD/, async () =>
            {
                var keys: Array<any> = ["NAME", "AGE"];
                var data: Array<any> = ["BigBlooper1", "string"];
                await storage.Write("dummy_test_table", keys, data);
            });

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'BigBlooper1'";
            var results: Array<object> = await storage.Query(query);
            assert.equal(results.length, 0);
        }),

        it("should throw ER_BAD_FIELD_ERROR and data not saved when writing invalid key to database", async () =>
        {
            await assertextentions.assertThrowsAsync(/ER_BAD_FIELD_ERROR/, async () =>
            {
                var keys: Array<any> = ["NAME", "NON_EXISTENT_FIELD"];
                var data: Array<any> = ["BigBlooper2", 6];
                await storage.Write("dummy_test_table", keys, data);
            });

            var query: string = "SELECT * FROM dummy_test_table WHERE NAME = 'BigBlooper2'";
            var results: Array<object> = await storage.Query(query);
            assert.equal(results.length, 0);
        });
    });

    after(async () =>
    {
        await storage.Query('DROP TABLE dummy_test_table');
        storage.Dispose();
    });
});