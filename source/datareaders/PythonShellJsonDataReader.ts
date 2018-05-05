import { Readable, Stream } from "stream"
import { IDataReader } from "./IDataReader"
const PythonShell = require("python-shell");
const json = require("JSONStream");

/**
 * PythonShellJsonDataReader.
 * 
 * Returns a stream to stdout of a specified python script.
 */
export class PythonShellJsonDataReader implements IDataReader
{
    private _filepath: string;
    private _jsonParsePath: string;
    private _readStream: Readable;
    private _pythonShell: any;

    /**
     * Constructor.
     * @param {string} filepath to python script to be executed
     * @param {string} jsonParsePath JSONPath to parse
     */
    public constructor(filepath: string, jsonParsePath: string)
    {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
    }

    /**
     * Launch python script and convert stdout into json data.
     * @override
     */
    public Initialize(): void
    {
        this._readStream = new Readable({objectMode: true});
        this._readStream._read = () => {};
        this._pythonShell = new PythonShell(this._filepath, {mode: "json"});

        this._pythonShell.stdout.on("data", (data: any) =>
        {
            this._readStream.push(data);
        });

        var __this: PythonShellJsonDataReader = this;
        this._pythonShell.end(function (err: Error, code: any, signal: any) {
            if (err)
            {
                throw err;
            }
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