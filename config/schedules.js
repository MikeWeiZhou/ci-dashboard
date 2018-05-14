const JsonDataCollector = require("../build/datacollectors/JsonDataCollector")
const PythonShellJsonDataCollector = require("../build/datacollectors/PythonShellJsonDataCollector")
const SampleDataInterface = require("../build/datainterfaces/SampleDataInterface")
const QaBuildsAndRunsFromBambooDataInterface = require("../build/datainterfaces/QaBuildsAndRunsFromBambooDataInterface")
const BugResolutionDatesDataInterface = require("../build/datainterfaces/BugResolutionDatesDataInterface")
const ResolvedStoryPointsDataInterface = require("../build/datainterfaces/ResolvedStoryPointsDataInterface")

const config = require("./config")

// Format of schedules should match interface in source/scheduler/ISchedule.ts
var schedules =
[
    // {
    //     Title: "Sample Data Source",
    //     DataCollector: new PythonShellJsonDataCollector.PythonShellJsonDataCollector("./data/sample_data_source.py"),
    //     DataInterface: new SampleDataInterface.SampleDataInterface(),
    //     RunIntervalInMinutes: 999
    // },
    {
        Title: "QA Builds and Runs from Bamboo",
        DataCollector: new JsonDataCollector.JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json"),
        DataInterface: new QaBuildsAndRunsFromBambooDataInterface.QaBuildsAndRunsFromBambooDataInterface(),
        RunIntervalInMinutes: 999
    },
    {
        Title: "Bug Resolution Dates",
        DataCollector: new JsonDataCollector.JsonDataCollector("./data/bug_data.json"),
        DataInterface: new BugResolutionDatesDataInterface.BugResolutionDatesDataInterface(),
        RunIntervalInMinutes: 999
    },
    {
        Title: "Resolved Story Points",
        DataCollector: new JsonDataCollector.JsonDataCollector("./data/story_data.json"),
        DataInterface: new ResolvedStoryPointsDataInterface.ResolvedStoryPointsDataInterface(),
        RunIntervalInMinutes: 999
    },
];

module.exports = schedules;