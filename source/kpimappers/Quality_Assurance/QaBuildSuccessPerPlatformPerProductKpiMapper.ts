import * as moment from "moment"
import { AvgPointsFunctions } from "./Functions/AvgPointsFunctions"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")

/**
 * QaBuildSuccessPerPlatformPerProduct.
 * 
 * QA Build Success vs Fail Per Platform Per Product.
 */
export class QaBuildSuccessPerPlatformPerProductKpiMapper extends KpiMapper
{
    public readonly Title: string = "QA Build Success Rate Per Platform Per Product";

    private _tablename: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

    private _from: string;
    private _to: string;

    // Start with splitting data points by how many days 
    private dataPointsToPlot = 0;

    /**
     * Returns an array of SQL query strings given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string[]} an array of one or more SQL query string
     * @override
     */
    protected getQueryStrings(from: string, to: string, dateRange: number): string[]
    {
        this._from = from;
        this._to = to;

        return [`
            SELECT PRODUCT_NAME, PLATFORM_NAME, 
            DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") AS Date, 
            AVG(IS_SUCCESS) as Success 
            FROM ${this._tablename} 
            Where BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}' 
            GROUP BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d"), PRODUCT_NAME, PLATFORM_NAME 
            ORDER BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d");
        `];
    }

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
    {
        var jsonArray: Array<any> = jsonArrays[0];
        var avgFunctions = new AvgPointsFunctions();

        // Edit the target and stretch goals here in decimal percantages
        const targetGoal = 0.70
        const stretchGoal = 0.90;

        // Invalid; One data point on a scatter chart shows nothing
        if (jsonArray.length == 1)
        {
            return null;
        }

        // Declare how many points to plot
        // Will always plot the first and last and in between will be
        // a number that is equal to or lower than points specified
        var plottingPoints = 30;

        // Windows products variable tracking
        var dxWinPointsToAdd = 0;
        var fxWinPointsToAdd = 0;
        var icWinPointsToAdd = 0;
        var mxWinPointsToAdd = 0;

        // Linux products variable tracking
        var dxLinPointsToAdd = 0;
        var fxLinPointsToAdd = 0;
        var icLinPointsToAdd = 0;
        var mxLinPointsToAdd = 0;

        // Mac products variable tracking
        var dxMacPointsToAdd = 0;
        var fxMacPointsToAdd = 0;
        var icMacPointsToAdd = 0;
        var mxMacPointsToAdd = 0;

        /*
         * Contains Array platforms from windows
         */
        var dxWindowsValue: Array<any> = [];
        var dxWindowsLabel: Array<any> = [];
        var dxWindowsAverage: Array<any> = [];

        var fxWindowsValue: Array<any> = [];
        var fxWindowsLabel: Array<any> = [];
        var fxWindowsAverage: Array<any> = [];

        var icWindowsValue: Array<any> = [];
        var icWindowsLabel: Array<any> = [];
        var icWindowsAverage: Array<any> = [];

        var mxWindowsValue: Array<any> = [];
        var mxWindowsLabel: Array<any> = [];
        var mxWindowsAverage: Array<any> = [];

        /*
         * Contains Array platforms from Linux
         */
        var dxLinuxValue: Array<any> = [];
        var dxLinuxLabel: Array<any> = [];
        var dxLinuxAverage: Array<any> = [];

        var fxLinuxValue: Array<any> = [];
        var fxLinuxLabel: Array<any> = [];
        var fxLinuxAverage: Array<any> = [];

        var icLinuxValue: Array<any> = [];
        var icLinuxLabel: Array<any> = [];
        var icLinuxAverage: Array<any> = [];

        var mxLinuxValue: Array<any> = [];
        var mxLinuxLabel: Array<any> = [];
        var mxLinuxAverage: Array<any> = [];

        /*
         * Contains Array platforms for Mac
         */ 
        var dxMacValue: Array<any> = [];
        var dxMacLabel: Array<any> = [];
        var dxMacAverage: Array<any> = [];

        var fxMacValue: Array<any> = [];
        var fxMacLabel: Array<any> = [];
        var fxMacAverage: Array<any> = [];

        var icMacValue: Array<any> = [];
        var icMacLabel: Array<any> = [];
        var icMacAverage: Array<any> = [];

        var mxMacValue: Array<any> = [];
        var mxMacLabel: Array<any> = [];
        var mxMacAverage: Array<any> = [];

        // 30 day difference example
        var getDaysLeft = avgFunctions.getHowManyDaysLeft(this._from, this._to);

        // Find out how many data points to split across using Math.Floor
        this.dataPointsToPlot = Math.floor((getDaysLeft/plottingPoints));

        // Don't edit these values
        // Contains Window first pushes
        var dxWinFirstPush = false;
        var fxWinFirstPush = false;
        var icWinFirstPush = false;
        var mxWinFirstPush = false;

        // Contains linux first pushes
        var dxLinFirstPush = false;
        var fxLinFirstPush = false;
        var icLinFirstPush = false;
        var mxLinFirstPush = false;

        // Contains mac first pushes
        var dxMacFirstPush = false;
        var fxMacFirstPush = false;
        var icMacFirstPush = false;
        var mxMacFirstPush = false;

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            // Check for windows platform
            // Windows code starts here
            if (jsonArray[i].PLATFORM_NAME == "Windows") {
                // Check for product names
                if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!dxWinFirstPush) {
                        dxWindowsValue.push(jsonArray[i].Success);
                        dxWindowsLabel.push(jsonArray[i].Date);
                        dxWinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            dxWindowsValue.push(jsonArray[i].Success);
                            dxWindowsLabel.push(jsonArray[i].Date);
                        } else {
                            dxWindowsAverage.push(jsonArray[i].Success);
                            ++dxWinPointsToAdd;
                            // once it meets the specific points then it'll add it to the value and label
                            // or if it is the final point
                            if ((dxWinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                                var averageValue = avgFunctions.getAveragePercentage(dxWindowsAverage);
                                dxWindowsValue.push(averageValue);
                                dxWindowsLabel.push(jsonArray[i].Date);

                                // clean everything up once it's over
                                // resets the points to 0
                                dxWinPointsToAdd = 0;

                                // clean data conained by popping from the array
                                dxWindowsAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!fxWinFirstPush) {
                        fxWindowsValue.push(jsonArray[i].Success);
                        fxWindowsLabel.push(jsonArray[i].Date);
                        fxWinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                        // Plot it normally
                        fxWindowsValue.push(jsonArray[i].Success);
                        fxWindowsLabel.push(jsonArray[i].Date);
                        } else {
                            fxWindowsAverage.push(jsonArray[i].Success);
                            ++fxWinPointsToAdd;
                            // once it meets the specific points then it'll add it to the value and label
                            // or if it is the final point
                            if ((fxWinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                                var averageValue = avgFunctions.getAveragePercentage(fxWindowsAverage);
                                fxWindowsValue.push(averageValue);
                                fxWindowsLabel.push(jsonArray[i].Date);

                                // clean everything up once it's over
                                // resets the points to 0
                                fxWinPointsToAdd = 0;

                                // clean data conained by popping from the array
                                fxWindowsAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!icWinFirstPush) {
                        icWindowsValue.push(jsonArray[i].Success);
                        icWindowsLabel.push(jsonArray[i].Date);
                        icWinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            // Plot it normally
                            icWindowsValue.push(jsonArray[i].Success);
                            icWindowsLabel.push(jsonArray[i].Date);
                        } else {
                           icWindowsAverage.push(jsonArray[i].Success);
                           ++icWinPointsToAdd;
                           // once it meets the specific points then it'll add it to the value and label
                           // or if it is the final point
                           if ((icWinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                               var averageValue = avgFunctions.getAveragePercentage(icWindowsAverage);
                               icWindowsValue.push(averageValue);
                               icWindowsLabel.push(jsonArray[i].Date);
   
                               // clean everything up once it's over
                               // resets the points to 0
                               icWinPointsToAdd = 0;
   
                               // clean data conained by popping from the array
                               icWindowsAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!mxWinFirstPush) {
                        mxWindowsValue.push(jsonArray[i].Success);
                        mxWindowsLabel.push(jsonArray[i].Date);
                        mxWinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            // Plot it normally
                            mxWindowsValue.push(jsonArray[i].Success);
                            mxWindowsLabel.push(jsonArray[i].Date);
                        } else {
                           mxWindowsAverage.push(jsonArray[i].Success);
                           ++mxWinPointsToAdd;
                           // once it meets the specific points then it'll add it to the value and label
                           // or if it is the final point
                           if ((mxWinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                               var averageValue = avgFunctions.getAveragePercentage(mxWindowsAverage);
                               mxWindowsValue.push(averageValue);
                               mxWindowsLabel.push(jsonArray[i].Date);
   
                               // clean everything up once it's over
                               // resets the points to 0
                               mxWinPointsToAdd = 0;
   
                               // clean data conained by popping from the array
                               mxWindowsAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } 
                // End platform Checking

            // Linux code starts here
            } else if (jsonArray[i].PLATFORM_NAME == "Linux") {
                if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!dxLinFirstPush) {
                        dxLinuxValue.push(jsonArray[i].Success);
                        dxLinuxLabel.push(jsonArray[i].Date);
                        dxLinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            dxLinuxValue.push(jsonArray[i].Success);
                            dxLinuxLabel.push(jsonArray[i].Date);
                        } else {
                            dxLinuxAverage.push(jsonArray[i].Success);
                            ++dxLinPointsToAdd;
                            // once it meets the specific points then it'll add it to the value and label
                            // or if it is the final point
                            if ((dxLinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                                var averageValue = avgFunctions.getAveragePercentage(dxLinuxAverage);
                                dxLinuxValue.push(averageValue);
                                dxLinuxLabel.push(jsonArray[i].Date);

                                // clean everything up once it's over
                                // resets the points to 0
                                dxLinPointsToAdd = 0;

                                // clean data conained by popping from the array
                                dxLinuxAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!fxLinFirstPush) {
                        fxLinuxValue.push(jsonArray[i].Success);
                        fxLinuxLabel.push(jsonArray[i].Date);
                        fxLinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                        // Plot it normally
                        fxLinuxValue.push(jsonArray[i].Success);
                        fxLinuxLabel.push(jsonArray[i].Date);
                        } else {
                            fxLinuxAverage.push(jsonArray[i].Success);
                            ++fxLinPointsToAdd;
                            // once it meets the specific points then it'll add it to the value and label
                            // or if it is the final point
                            if ((fxLinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                                var averageValue = avgFunctions.getAveragePercentage(fxLinuxAverage);
                                fxLinuxValue.push(averageValue);
                                fxLinuxLabel.push(jsonArray[i].Date);

                                // clean everything up once it's over
                                // resets the points to 0
                                fxLinPointsToAdd = 0;

                                // clean data conained by popping from the array
                                fxLinuxAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                     // get the starting point of the graph and add it in
                     if (!icLinFirstPush) {
                        icLinuxValue.push(jsonArray[i].Success);
                        icLinuxLabel.push(jsonArray[i].Date);
                        icLinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            // Plot it normally
                            icLinuxValue.push(jsonArray[i].Success);
                            icLinuxLabel.push(jsonArray[i].Date);
                        } else {
                           icLinuxAverage.push(jsonArray[i].Success);
                           ++icLinPointsToAdd;
                           // once it meets the specific points then it'll add it to the value and label
                           // or if it is the final point
                           if ((icLinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                               var averageValue = avgFunctions.getAveragePercentage(icLinuxAverage);
                               icLinuxValue.push(averageValue);
                               icLinuxLabel.push(jsonArray[i].Date);
   
                               // clean everything up once it's over
                               // resets the points to 0
                               icLinPointsToAdd = 0;
   
                               // clean data conained by popping from the array
                               icLinuxAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                     // get the starting point of the graph and add it in
                     if (!mxLinFirstPush) {
                        mxLinuxValue.push(jsonArray[i].Success);
                        mxLinuxLabel.push(jsonArray[i].Date);
                        mxLinFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            // Plot it normally
                            mxLinuxValue.push(jsonArray[i].Success);
                            mxLinuxLabel.push(jsonArray[i].Date);
                        } else {
                           mxLinuxAverage.push(jsonArray[i].Success);
                           ++mxLinPointsToAdd;
                           // once it meets the specific points then it'll add it to the value and label
                           // or if it is the final point
                           if ((mxLinPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                               var averageValue = avgFunctions.getAveragePercentage(mxLinuxAverage);
                               mxLinuxValue.push(averageValue);
                               mxLinuxLabel.push(jsonArray[i].Date);
   
                               // clean everything up once it's over
                               // resets the points to 0
                               mxLinPointsToAdd = 0;
   
                               // clean data conained by popping from the array
                               mxLinuxAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                }

            // End platform Checking
            // Mac code starts here
            } else { // It is a Mac platform
                if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!dxMacFirstPush) {
                        dxMacValue.push(jsonArray[i].Success);
                        dxMacLabel.push(jsonArray[i].Date);
                        dxMacFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            dxMacValue.push(jsonArray[i].Success);
                            dxMacLabel.push(jsonArray[i].Date);
                        } else {
                            dxMacAverage.push(jsonArray[i].Success);
                            ++dxMacPointsToAdd;
                            // once it meets the specific points then it'll add it to the value and label
                            // or if it is the final point
                            if ((dxMacPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                                var averageValue = avgFunctions.getAveragePercentage(dxMacAverage);
                                dxMacValue.push(averageValue);
                                dxMacLabel.push(jsonArray[i].Date);

                                // clean everything up once it's over
                                // resets the points to 0
                                dxMacPointsToAdd = 0;

                                // clean data conained by popping from the array
                                dxMacAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 
                // End device checking if statement

                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!fxMacFirstPush) {
                        fxMacValue.push(jsonArray[i].Success);
                        fxMacLabel.push(jsonArray[i].Date);
                        fxMacFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                        // Plot it normally
                        fxMacValue.push(jsonArray[i].Success);
                        fxMacLabel.push(jsonArray[i].Date);
                        } else {
                            fxMacAverage.push(jsonArray[i].Success);
                            ++fxMacPointsToAdd;
                            // once it meets the specific points then it'll add it to the value and label
                            // or if it is the final point
                            if ((fxMacPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                                var averageValue = avgFunctions.getAveragePercentage(fxMacAverage);
                                fxMacValue.push(averageValue);
                                fxMacLabel.push(jsonArray[i].Date);

                                // clean everything up once it's over
                                // resets the points to 0
                                fxMacPointsToAdd = 0;

                                // clean data conained by popping from the array
                                fxMacAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 
                // End device checking if statement

                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!icMacFirstPush) {
                        icMacValue.push(jsonArray[i].Success);
                        icMacLabel.push(jsonArray[i].Date);
                        icMacFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            // Plot it normally
                            icMacValue.push(jsonArray[i].Success);
                            icMacLabel.push(jsonArray[i].Date);
                        } else {
                           icMacAverage.push(jsonArray[i].Success);
                           ++icMacPointsToAdd;
                           // once it meets the specific points then it'll add it to the value and label
                           // or if it is the final point
                           if ((icMacPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                               var averageValue = avgFunctions.getAveragePercentage(icMacAverage);
                               icMacValue.push(averageValue);
                               icMacLabel.push(jsonArray[i].Date);
   
                               // clean everything up once it's over
                               // resets the points to 0
                               icMacPointsToAdd = 0;
   
                               // clean data conained by popping from the array
                               icMacAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                // End device checking if statement
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    // get the starting point of the graph and add it in
                    if (!mxMacFirstPush) {
                        mxMacValue.push(jsonArray[i].Success);
                        mxMacLabel.push(jsonArray[i].Date);
                        mxMacFirstPush = true;                        
                    } else {
                        // If there is more points than how many days left to plot
                        if (getDaysLeft < plottingPoints) {
                            // Plot it normally
                            mxMacValue.push(jsonArray[i].Success);
                            mxMacLabel.push(jsonArray[i].Date);
                        } else {
                           mxMacAverage.push(jsonArray[i].Success);
                           ++mxMacPointsToAdd;
                           // once it meets the specific points then it'll add it to the value and label
                           // or if it is the final point
                           if ((mxMacPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                               var averageValue = avgFunctions.getAveragePercentage(mxMacAverage);
                               mxMacValue.push(averageValue);
                               mxMacLabel.push(jsonArray[i].Date);
   
                               // clean everything up once it's over
                               // resets the points to 0
                               mxMacPointsToAdd = 0;
   
                               // clean data conained by popping from the array
                               mxMacAverage = [];
                            } // end inner if
                        } // end inner else statment
                    } // end outer else statement 

                } // End device checking if statement

            } // End else for MAC platform statement  
        } // End for statement

        return {
            data: [{
                // Start processing windows data
                x: dxWindowsLabel,
                y: dxWindowsValue,
                name: "DX Windows",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: fxWindowsLabel,
                y: fxWindowsValue,
                name: "FX Windows",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: icWindowsLabel,
                y: icWindowsValue,
                name: "IC Windows",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: mxWindowsLabel,
                y: mxWindowsValue,
                name: "MX Windows",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            // End processing windows
            {
            // Start processing linux
                x: dxLinuxLabel,
                y: dxLinuxValue,
                name: "DX Linux",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: fxLinuxLabel,
                y: fxLinuxValue,
                name: "FX Linux",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: icLinuxLabel,
                y: icLinuxValue,
                name: "IC Linux",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: mxLinuxLabel,
                y: mxLinuxValue,
                name: "MX Linux",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            // End processing linux
            {
            // Start processing Mac
                x: dxMacLabel,
                y: dxMacValue,
                name: "DX Mac",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: fxMacLabel,
                y: fxMacValue,
                name: "FX Mac",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: icMacLabel,
                y: icMacValue,
                name: "IC Mac",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: mxMacLabel,
                y: mxMacValue,
                name: "MX Mac",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            // End processing mac
            }],
            layout: {
                title: this.Title,
                xaxis: {
                    title: "Date",
                    fixedrange: true
                },
                yaxis: {
                    title: 'Build Percentage',
                    tickformat: ',.0%',
                    fixedrange: true,
                    range: [0,1]
                },
                shapes: [{
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: targetGoal,
                    x1: 1,
                    y1: targetGoal,
                    line: {
                        color: 'rgb(0, 255, 0)',
                        width: 4,
                        dash:'dot'
                    }
                },
                {
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: stretchGoal,
                    x1: 1,
                    y1: stretchGoal,
                    line: {
                        color: 'gold',
                        width: 4,
                        dash:'dot'
                    }
                }]
            },
            frames: [],
            config: {displayModeBar: false}
        };
    }
}