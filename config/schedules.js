const JsonDataCollector = require("../build/datacollectors/JsonDataCollector");
const QaBuildsAndRunsFromBambooDataInterface = require("../build/datainterfaces/QaBuildsAndRunsFromBambooDataInterface");
const config = require("./config")

var schedules = {};

/*************
 * S E T U P *
 *************/

// Format of schedules should match interface in source/scheduler/ISchedule.ts
schedules =
[
    {
        Title: "QA Builds and Runs from Bamboo",
        DataCollector: new JsonDataCollector.JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json", "*"),
        DataInterface: new QaBuildsAndRunsFromBambooDataInterface.QaBuildsAndRunsFromBambooDataInterface(),
        RunIntervalInMinutes: 999
    }
];

module.exports = schedules;