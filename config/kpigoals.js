const config = require("./config")

var kpigoals = {};

kpigoals =
{
    story_points_velocity:
    {
        target_annual:  1088,
        stretch_annual: 1137
    },
    build_success_rate:
    {
        target_rate: 0.75,
        stretch_rate: 0.9
    }
};

module.exports = kpigoals;