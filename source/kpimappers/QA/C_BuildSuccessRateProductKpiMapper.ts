import * as moment from "moment"
import { BuildSuccessRateSegmentKpiMapper } from "../BuildSuccessRateSegmentKpiMapper"
import { IKpiState } from "../IKpiState"

/**
 * C_BuildSuccessRateProductKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class C_BuildSuccessRateProductKpiMapper extends BuildSuccessRateSegmentKpiMapper
{
    protected splitByColumn: string = "PRODUCT_NAME";
    protected segmentColumn: string = "";
    protected segmentValue: string = "";
    public readonly Title: string = `Build Success Rate Per Product`;
}