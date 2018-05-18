import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * E_BuildSuccessRateLinuxKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class E_BuildSuccessRateLinuxKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected splitByColumn: string = "CYCLE";
    protected segmentColumn: string = "PLATFORM_NAME";
    protected segmentValue: string = "'Linux'";
    public readonly Title: string = `Build Success Rate (${this.segmentValue})`;
}