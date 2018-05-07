import * as fs from "fs"
import { Stream } from "stream"
import { IDataCollector } from "./IDataCollector"
const json = require("JSONStream");

/**
 * JsonDataCollector.
 * 
 * Returns a stream to the JSON file.
 */
export class JsonDataCollector implements IDataCollector
{
    private _filepath: string;
    private _jsonParsePath: string;

    /**
     * Constructor.
     * @param {string} filepath to JSON to-be read
     * @param {string} jsonParsePath JSONPath to parse
     */
    public constructor(filepath: string, jsonParsePath: string)
    {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
    }

    /**
     * Not used.
     * @param {Date} from
     * @param {Date} to
     * @override
     */
    public Initialize(from: Date, to: Date): void
    {
    }

    /**
     * Returns a Stream stream of the JSON file.
     * @returns {Stream} stream to the JSON file
     * @override
     */
    public GetStream(): Stream
    {
        return fs.createReadStream(this._filepath)
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