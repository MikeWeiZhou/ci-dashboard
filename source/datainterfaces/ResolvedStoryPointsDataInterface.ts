import * as moment from "moment"
import { IDataInterface } from "./IDataInterface"
const config = require("../../config/config");

/**
 * ResolvedStoryPointsDataInterface.
 */
export class ResolvedStoryPointsDataInterface implements IDataInterface
{
    /**
     * Table name for data set.
     * @override
     */
    public readonly TableName: string = config.db.tablename.resolved_story_points;

    /**
     * Table columns for data set.
     * Order must match data array returned from Transform().
     * @override
     */
    public readonly TableColumns: Array<string> =
    [
        "STORY_ID",
        "CYCLE",
        "RESOLUTION_DATE",
        "STORY_POINTS"
    ];

    /**
     * Returns a data record derrived from a JSON object ready to be consumed by IDataStorage.
     * Array order must match TableColumns.
     * @param {any} o original JSON object
     * @returns {Array<any>} data record as an array
     * @override
     */
    public Transform(o: any): Array<any>
    {
        return [
            o.key,                  // STORY_ID
            o.key.substring(0, 6),  // CYCLE
            moment(o.value.resolution_date).format(config.dateformat.mysql), // RESOLUTION_DATE
            o.value.story_points,   // STORY_POINTS
        ];
    }
}