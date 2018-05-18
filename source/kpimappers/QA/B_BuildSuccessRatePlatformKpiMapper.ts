import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * B_BuildSuccessRatePlatformKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class B_BuildSuccessRatePlatformKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected splitByColumn: string = "PLATFORM_NAME";
    protected segmentColumn: string = "";
    protected segmentValue: string = "";
    public readonly Title: string = `Build Success Rate Per Platform`;
}