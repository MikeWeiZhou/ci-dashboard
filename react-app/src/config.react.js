const Path = require("path");

module.exports = {
    config_dashboard: () => [ __dirname, Path.join(__dirname, "../config/config.dashboard.js") ]
};
