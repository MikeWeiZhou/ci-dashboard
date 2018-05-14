import * as moment from "moment"
import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const kpigoals = require("../../config/kpigoals")
const config = require("../../config/config")

/**
 * AverageLineKpiMapper.
 */
export abstract class AverageLineKpiMapper extends KpiMapper
{
    // Date range for Plotly to limit lower and upperbounds
    protected chartFromDate: string;
    protected chartToDate: string;

    // Data date range (contains more data points than selected date range)
    protected dataFromDate: string;
    protected dataToDate: string;

    // Number of days in one data point/period
    protected daysInOneDataPoint: number;


    // Minimum number of data points preferred in chart
    // # of data points on actual chart will always be between date range and 2x+1
    private readonly _preferredMinNumOfDataPoints: number = 15;

    // Expected number of data points based on daysInOneDataPoint
    private _expectedNumDataPoints: number;

    // Selected date range (for MySQL)
    private _from: string;
    private _to: string;

    /**
     * Makes calculations of required data date ranges, days in a data point, and number of
     * required data points.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string[]} not used
     * @override
     */
    protected getQueryStrings(from: string, to: string, dateRange: number): string[]
    {
        this._from = from;
        this._to = to;

        this.chartFromDate = moment(from).format(config.dateformat.charts);
        this.chartToDate = moment(to).format(config.dateformat.charts);

        // Calculate number of days per data point
        var minNumOfDataPoints = Math.min(dateRange, this._preferredMinNumOfDataPoints);
        this.daysInOneDataPoint = Math.floor(dateRange / minNumOfDataPoints);

        // If date range not fully divisible by this.daysInOneDataPoint, need to extend date range
        // to ensure each data point has exactly this.daysInOneDataPoint days.
        // Also, 1 - 2 data points are added to ensure the starting date plotted <= from date
        var numDaysToAdd = 2 * this.daysInOneDataPoint - (dateRange % this.daysInOneDataPoint);
        this.dataFromDate = moment(from)
            .subtract(numDaysToAdd, "days")
            .format(config.dateformat.mysql);
        this.dataToDate = to;

        // Calculate number of expected data points assumming no missing/empty data in date range
        var dataDateRange = (moment(this._to).diff(this.dataFromDate, "days") + 1);
        this._expectedNumDataPoints = dataDateRange / this.daysInOneDataPoint;

        // Not used
        return [];
    }

    /**
     * Returns dates (x) and values (y) of the chart.
     * Any missing data points are assumed to be zero.
     * @param {Array<any>} data
     * @returns {object} dates and values
     */
    protected getChartZeroMissingData(data: Array<any>): object
    {
        var dates: Array<any> = [];
        var values: Array<any> = [];

        var i: number = 0;
        var period: number = this._expectedNumDataPoints;
        while (period >= 0)
        {
            let date: string = moment(this._to)
                .subtract(period * this.daysInOneDataPoint, "days")
                .format(config.dateformat.charts);
            let point: number = (data[i] && data[i].PERIOD == period)
                ? data[i++].VALUE / this.daysInOneDataPoint
                : 0; // ZEROES missing data point
            dates.push(date);
            values.push(point);
            --period;
        }

        return {
            dates: dates,
            values: values
        };
    }

    /**
     * Returns dates (x) and values (y) of the chart.
     * Any missing data points are ignored (not plotted).
     * @param {Array<any>} data
     * @returns {object} dates and values
     */
    protected getChartIgnoreMissingData(data: Array<any>): object
    {
        var dates: Array<any> = [];
        var values: Array<any> = [];
        for (let i: number = 0; i < data.length; ++i)
        {
            dates.push(moment(this._to)
                .subtract(data[i].PERIOD * this.daysInOneDataPoint, "days")
                .format(config.dateformat.charts));
            values.push(data[i].VALUE);
        }

        return {
            dates: dates,
            values: values
        };
    }
}