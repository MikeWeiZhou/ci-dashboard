var config = {};


/***********************
 * W E B   S E R V E R *
 ***********************/

config.webserver =
{
    port:               8080,
    public_directory:   __dirname.replace(/\\/g, '/').replace(/\/[\w-]+$/, '') + "/react-demo/build"
};

config.webserver.response =
{
    ok:         200,
    error:      500,
    no_data:    404,
    no_exists:  404
};

/*******************
 * D A T A B A S E *
 *******************/

config.db = {};

config.db.connection =
{
    host:       "localhost",
    port:       3306,
    database:   "cidashboard",
    user:       "root",
    password:   ""
};

config.db.tablename =
{
    // Stores meta info on each IDataInterface source
    //      e.g. qa_builds_and_runs_from_bamboo
    data_source_tracker:            "data_source_tracker",

    qa_builds_and_runs_from_bamboo: "qa_builds_and_runs_from_bamboo",
    bug_resolution_dates:           "bug_resolution_dates",
    resolved_story_points:          "resolved_story_points"
}

/*********************
 * S C H E D U L E R *
 *********************/

config.scheduler =
{
    // New data sources will start pulling records saved from this starting date
    // Unless manually set when scheduling
    starting_data_date: new Date("2010-01-01")
};

/*****************
 * L O G G I N G *
 *****************/

config.log =
{
    directory: "logs"
};

/*************************
 * D A T E   F O R M A T *
 *************************/

/* Check different formats on: https://momentjs.com/docs/#/parsing/string-format/
    INPUT       EXAMPLE         DESCRIPTION
    -----       -------         -----------
    YYYY	    2014	        4 or 2 digit year
    YY	        14	            2 digit year
    Y	        -25	            Year with any number of digits and sign
    Q	        1..4	        Quarter of year. Sets month to first month in quarter.
    M MM	    1..12	        Month number
    MMM MMMM	Jan..December	Month name in locale set by moment.locale()
    D DD	    1..31	        Day of month
    Do	        1st..31st	    Day of month with ordinal
    DDD DDDD	1..365	        Day of year
    X	        1410715640.579	Unix timestamp
    x	        1410715640579	Unix ms timestamp

    H HH	    0..23	        Hours (24 hour time)
    h hh	    1..12	        Hours (12 hour time used with a A.)
    k kk	    1..24	        Hours (24 hour time from 1 to 24)
    a A	        am pm	        Post or ante meridiem (Note the one character a p are also considered valid)
    m mm	    0..59	        Minutes
    s ss	    0..59	        Seconds
    S SS SSS	0..999	        Fractional seconds
    Z ZZ	    +12:00	        Offset from UTC as +-HH:mm, +-HHmm, or Z
*/
config.dateformat =
{
    // used for querying and inserting dates into MySQL database
    mysql: "YYYY-MM-DD HH:mm:ss",

    // used for communication with python scripts
    python: "YYYY-MM-DD HH:mm:ss"
};

module.exports = config;