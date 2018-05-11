const DefectsMajorCreatedResolvedKpiMapper = require("../build/kpimappers/DefectsMajorCreatedResolvedKpiMapper")
const DefectsCriticalCreatedResolvedKpiMapper = require("../build/kpimappers/DefectsCriticalCreatedResolvedKpiMapper")
const DefectsTotalNumberOfBugsKpiMapper = require("../build/kpimappers/DefectsTotalNumberOfBugsKpiMapper")
const StoryPointsVelocityKpiMapper = require("../build/kpimappers/StoryPointsVelocityKpiMapper")
const QaOverallBuildSuccessKpiMapper = require("../build/kpimappers/QaOverallBuildSuccessKpiMapper")
const QaBuildSuccessPerPlatformPerProductKpiMapper = require("../build/kpimappers/QaBuildSuccessPerPlatformPerProductKpiMapper")
const QaBuildSuccessPerPlatformKpiMapper = require("../build/kpimappers/QaBuildSuccessPerPlatformKpiMapper")
const QaBuildSuccessPerProductKpiMapper = require("../build/kpimappers/QaBuildSuccessPerProductKpiMapper")
const BuildSuccessRateKpiMapper = require("../build/kpimappers/BuildSuccessRateKpiMapper")

const config = require("./config")

var kpis = {};

kpis.category =
{
    defects: "Defects",
    dev: "Development",
    qa: "Quality Assurance"
};

kpis.list =
{
    defects:
    {
        major_defects_created: new DefectsMajorCreatedResolvedKpiMapper.DefectsMajorCreatedResolvedKpiMapper(),
        critical_defects_created: new DefectsCriticalCreatedResolvedKpiMapper.DefectsCriticalCreatedResolvedKpiMapper(),
        total_defects: new DefectsTotalNumberOfBugsKpiMapper.DefectsTotalNumberOfBugsKpiMapper()
    },
    dev:
    {
        story_points_velocity: new StoryPointsVelocityKpiMapper.StoryPointsVelocityKpiMapper()
    },
    qa:
    {
        overall_builds_success: new QaOverallBuildSuccessKpiMapper.QaOverallBuildSuccessKpiMapper(),
        build_success_rate_per_platform_per_product: new QaBuildSuccessPerPlatformPerProductKpiMapper.QaBuildSuccessPerPlatformPerProductKpiMapper(),
        build_success_rate_per_platform : new QaBuildSuccessPerPlatformKpiMapper.QaBuildSuccessPerPlatformKpiMapper(),
        build_success_rate_per_product: new QaBuildSuccessPerProductKpiMapper.QaBuildSuccessPerProductKpiMapper(),
        build_success_rate: new BuildSuccessRateKpiMapper.BuildSuccessRateKpiMapper()
    }
};

module.exports = kpis;