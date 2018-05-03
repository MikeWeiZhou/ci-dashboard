/**
 * IKpi.
 */
export default interface IKpi
{
    /**
     * Returns a Plotly state object.
     */
    GetPlotlyState(): Promise<any>;
}