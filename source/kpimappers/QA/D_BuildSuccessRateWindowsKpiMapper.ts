import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * D_BuildSuccessRateWindowsKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class D_BuildSuccessRateWindowsKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected splitByColumn: string = "CYCLE";
    protected segmentColumn: string = "PLATFORM_NAME";
    protected segmentValue: string = "'Windows'";
    public readonly Title: string = `Build Success Rate (${this.segmentValue})`;
}