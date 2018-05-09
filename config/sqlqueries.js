const config = require("./config");

const sqlqueries = {};

/*************
 * S E T U P *
 *************/

sqlqueries.setup =
[
    // Create data source tracker table
    `CREATE TABLE ${config.db.tablename.data_source_tracker}
    (
        TABLE_NAME  VARCHAR(255)    NOT NULL PRIMARY KEY,
        FROM_DATE   DATETIME        NOT NULL DEFAULT '2000-01-10',
        TO_DATE     DATETIME        NOT NULL DEFAULT '2000-01-10'
    )`,

    // Create QA Builds and Runs from Bamboo data table
    `CREATE TABLE ${config.db.tablename.qa_builds_and_runs_from_bamboo}
    (
        BUILDRESULTSUMMARY_ID           INT             NOT NULL PRIMARY KEY,
        MINUTES_TOTAL_QUEUE_AND_BUILD   INT             NOT NULL,
        BUILD_COMPLETED_DATE            DATETIME        NOT NULL,
        CYCLE                           CHAR(6)         NOT NULL,
        PLATFORM_CODE                   CHAR(3)         NOT NULL,
        PRODUCT_CODE                    CHAR(2)         NOT NULL,
        PLATFORM_NAME                   VARCHAR(50)     NOT NULL,
        PRODUCT_NAME                    VARCHAR(50)     NOT NULL,
        IS_DEFAULT                      TINYINT(1)      NOT NULL,
        BUILD_STATE                     VARCHAR(30)     NOT NULL,
        BRANCH_ID                       INT
    )`,
    // Add to data source tracker table
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.qa_builds_and_runs_from_bamboo}')`
 ];

 module.exports = sqlqueries;