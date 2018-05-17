import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * F_BuildSuccessRateMacKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class F_BuildSuccessRateMacKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected splitByColumn: string = "CYCLE";
    protected segmentColumn: string = "PLATFORM_NAME";
    protected segmentValue: string = "'Mac'";
    public readonly Title: string = `Build Success Rate (${this.segmentValue})`;
}