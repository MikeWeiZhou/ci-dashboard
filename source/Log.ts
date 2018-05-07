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
    var date: Date = new Date();
    var datestamp: string = moment.utc(date).format("YYYY-MM-DD HH.mm.ss");
    var rand: number = Math.floor((Math.random() * 1000) + 1);
    var filename: string = `${logDirectory}/${datestamp} ${rand}.log`;
    var metadata: string = `TIMESTAMP: ${date}\n\n${additionalInfo}`;

    writeFile(filename, `${metadata}\n\n${error}\n\n${error.stack}`, (error: Error) =>
    {
        if (error)
        {
            console.log(error);
        }
    });
}