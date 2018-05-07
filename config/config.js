var config = {};

/**
 * Database
 */
config.db =
{
    host: "localhost",
    dbname: "cidashboard",
    username: "root",
    password: "password",

    tablenames:
    {
        // Stores meta info on each IDataInterface model
        //      e.g. qa_builds_and_runs_from_bamboo
        data_models_tracker: "data_models_tracker",

        qa_builds_and_runs_from_bamboo: "qa_builds_and_runs_from_bamboo"
    }
};

/**
 * Scheduler
 */
config.scheduler =
{
    // New data sources will start pulling records saved from this starting date
    starting_data_date: new Date("2010-01-01"),

    // In minutes
    intervals:
    {
        qa_builds_and_runs_from_bamboo: 100
    }
};

/**
 * Logging
 * 
 * If directory does not exist, no logs will be written. i.e. create that folder.
 */
config.log =
{
    directory: "logs"
}

/**
 * Date Format (using moment library)
 * 
 * Check different formats on: https://momentjs.com/docs/#/parsing/string-format/
 */
config.dateformat =
{
    // used for querying and inserting dates into MySQL database
    mysql: "YYYY-MM-DD HH:mm:ss",

    // used for communication with python scripts
    python: "YYYY-MM-DD HH:mm:ss"
};

module.exports = config;