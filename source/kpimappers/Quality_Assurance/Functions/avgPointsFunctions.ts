import * as moment from "moment"

/**
 * IDataInterface.
 * 
 * Contains functions that will be used globally
 */
export class AvgPointsFunctions
{
    /**
     * Returns how many days are remaining in between two dates
     * @param {string} from date
     * @param {string} to date
     * @returns {var} a value on how many days left on an integer
     */
    public getHowManyDaysLeft(from:string, to:string)
    {        
        var daysRemaining = moment(to).diff(from,'days');
        return daysRemaining;
    }

    /**
     * Using an array stored, it will return the average of the points
     * @param {Array<any>[]} valueArrays
     * @return {var} a value on the average of the perentages
     */
    public getAveragePercentage(valueArrays: Array<any>)
    {
        var divideCounter = 0;
        var sum = 0;
        for(let i: number = 0; i < valueArrays.length; ++i) {
            sum += valueArrays[i];
            ++divideCounter;
        }
        return sum / divideCounter
    }

    /**
     * With the data that is stored to find out the average of the points
     * Cleans it up by popping all the values stored
     * @param {Array<any>[]} avgArrayData
     */
    public cleanAverageData(avgArrayData: Array<any>)
    {
        avgArrayData = [];
        return avgArrayData;
    }
}