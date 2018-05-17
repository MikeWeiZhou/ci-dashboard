import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * A_BuildSuccessRateCycleKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class A_BuildSuccessRateCycleKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected splitByColumn: string = "CYCLE";
    protected segmentColumn: string = "";
    protected segmentValue: string = "";
    public readonly Title: string = `Build Success Rate Per Cycle`;
}