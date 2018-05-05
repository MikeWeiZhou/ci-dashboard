var config = {};

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

module.exports = config;