/**
 * IKpiState.
 * 
 * Interface of how a KpiState object should look like.
 */
export interface IKpiState
{
    data: Array<any>;
    layout: object;
    frames: Array<any>;
    config: object;
}