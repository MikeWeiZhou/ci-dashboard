var config = {};

/**
 * Database
 */
config.db =
{
    host: "localhost",
    dbname: "cidashboard",
    username: "root",
    password: "password"
};
config.db.tablenames =
{
    qa_builds_and_runs_from_bamboo: "qa_builds_and_runs_from_bamboo"
};

/**
 * Log
 * 
 * If directory does not exist, no logs will be written. i.e. create that folder.
 */
config.log =
{
    directory: "logs"
};

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