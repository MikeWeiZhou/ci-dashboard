import * as moment from "moment"
import { writeFile } from "fs"
const config = require("../config/config");

const logDirectory: string = "./" + config.log.directory;

/**
 * Log error messages.
 * @param {Error} error object
 * @param {string} additionalInfo to be logged
 */
export function Log(error: Error, additionalInfo: string)
{
    var datestamp: string = moment().format(config.dateformat.log);
    var filename: string = `${logDirectory}/${datestamp}.log`;
    var metadata: string = `TIMESTAMP: ${datestamp}\n\n${additionalInfo}`;

    writeFile(filename, `${metadata}\n\n${error}\n\n${error.stack}`, (error: Error) =>
    {
        if (error)
        {
            console.log(error);
        }
    });
}