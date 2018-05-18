const config = require("./config")

var kpigoals = {};

kpigoals =
{
    // kpimappers/AverageLineExamples/BuildTimeFromQueueKpiMapper
    build_time_from_queue:
    {
        target_minutes: 60,
        stretch_minutes: 30
    },

    // kpimappers/AverageLineExamples/StoryPointsVelocityKpiMapper
    story_points_velocity:
    {
        target_annual:  1088,
        stretch_annual: 1137
    },

    // kpimappers/AverageLineExamples/BuildSuccessRateKpiMapper
    build_success_rate:
    {
        target_rate: 0.75,
        stretch_rate: 0.9
    },

    bugs_per_day:
    {
        target: 1,
        stretch: 0.75
    },
    bugs_rc_difference:
    {
        target: 100,
        stretch: 200
    },
    bugs_resolution_time_major:
    {
        target: 180,
        stretch: 90
    },
    bugs_resolution_time_critical:
    {
        target: 30,
        stretch: 15
    }
};

module.exports = kpigoals;