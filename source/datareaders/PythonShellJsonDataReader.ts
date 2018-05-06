import * as moment from "moment"
import { Readable, Stream } from "stream"
import { IDataReader } from "./IDataReader"
const PythonShell = require("python-shell");
const json = require("JSONStream");
const config = require("../../config/config");

/**
 * PythonShellJsonDataReader.
 * 
 * Returns a stream to stdout of a specified python script.
 */
export class PythonShellJsonDataReader implements IDataReader
{
    private _filepath: string;
    private _jsonParsePath: string;
    private _fromDate: string;
    private _toDate: string;
    private _readStream: Readable;
    private _pythonShell: any;

    /**
     * Constructor.
     * @param {string} filepath to python script to be executed
     * @param {string} jsonParsePath JSONPath to parse
     */
    public constructor(filepath: string, jsonParsePath: string, fromDate: Date, toDate: Date)
    {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
        this._fromDate = moment(fromDate).format(config.dateformat.python);
        this._toDate = moment(toDate).format(config.dateformat.python);
    }

    /**
     * Launch python script, send requested date range, and add event listeners.
     * @override
     */
    public Initialize(): void
    {
        this._readStream = new Readable({objectMode: true});
        this._readStream._read = () => {};
        this._pythonShell = new PythonShell(this._filepath, {mode: "json"});

        // send requested date ranges
        this._pythonShell.send(`${this._fromDate}\n${this._toDate}`);

        // listen for data and push to stream when available
        this._pythonShell.stdout.on("data", (data: any) =>
        {
            this._readStream.push(data);
        });

        // executes when python script ends
        var __this: PythonShellJsonDataReader = this;
        this._pythonShell.end((err: Error, code: number, signal: any) =>
        {
            // exit code = 0 means executed successfully
            //           = 1 means program exception, e.g. division by zero
            // can have python script call sys.exit(5) to give error code of 5

            if (err)
            {
                throw err;
            }

            // signal end of stream
            __this._readStream.push(null);
        });
    }

    /**
     * Returns a Stream to the python script output.
     * @returns {Stream} stream to the python script output
     * @override
     */
    public GetStream(): Stream
    {
        return this._readStream
            .pipe(json.parse(this._jsonParsePath));
    }

    /**
     * Not used.
     * @override
     */
    public Dispose(): void
    {
    }
}