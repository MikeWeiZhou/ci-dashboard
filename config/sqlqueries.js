const config = require("./config")

var sqlqueries = {};

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
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.qa_builds_and_runs_from_bamboo}')`,

    // Create Bug Resolution Dates data table
    `CREATE TABLE ${config.db.tablename.bug_resolution_dates}
    (
        BUG_ID          VARCHAR(15) NOT NULL PRIMARY KEY,
        PRODUCT         VARCHAR(15) NOT NULL,
        PRIORITY        VARCHAR(20) NOT NULL,
        CREATION_DATE   DATETIME    NOT NULL,
        RESOLUTION_DATE DATETIME
    )`,
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.bug_resolution_dates}')`,

    // Create Resolved Story Points data table
    `CREATE TABLE ${config.db.tablename.resolved_story_points}
    (
        STORY_ID        VARCHAR(15) NOT NULL PRIMARY KEY,
        CYCLE           CHAR(6)     NOT NULL,
        RESOLUTION_DATE DATETIME    NOT NULL,
        STORY_POINTS    FLOAT
    )`,
    `INSERT INTO ${config.db.tablename.data_source_tracker} (TABLE_NAME)
        VALUES ('${config.db.tablename.resolved_story_points}')`
];

module.exports = sqlqueries;