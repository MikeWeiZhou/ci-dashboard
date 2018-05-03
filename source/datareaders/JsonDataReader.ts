const json = require("JSONStream");

import * as fs from "fs"
import { Writable } from "stream"

import IDataReader from "./IDataReader"

/**
 * JsonDataReader.
 * 
 * Returns a stream to the JSON file.
 */
export default class JsonDataReader implements IDataReader
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
     * Initialize the data source.
     * @override
     */
    public Initialize(): void
    {
    }

    /**
     * Returns a Writable stream of the csv file.
     * @returns {Writable} Writable stream to the csv file
     * @override
     */
    public GetStream(): Writable
    {
        return fs.createReadStream(this._filepath)
            .pipe(json.parse(this._jsonParsePath));
    }

    /**
     * Cleanup/dispose any open resources.
     * @override
     */
    public Cleanup(): void
    {
    }
}