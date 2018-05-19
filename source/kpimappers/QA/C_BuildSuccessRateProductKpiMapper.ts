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
    protected groupByColumn: string = "PRODUCT_NAME";
    protected filterColumn: string = "";
    protected filterValue: string = "";
    public readonly Title: string = `Build Success Rate Per Product`;
}