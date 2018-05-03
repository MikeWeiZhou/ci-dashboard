import { Writable } from "stream"
import IStorage from "./storages/IStorage";

/**
 * WriteStream.
 * 
 * Writes JSON objects using a given Storage medium and pushes it down the pipeline.
 */
export default class WriteStream extends Writable
{
    private _storage: IStorage;

    /**
     * Constructor.
     * @param {IStorage} storage used to transform the JSON object
     */
    public constructor(storage: IStorage)
    {
        // objectMode: stream accepts any JS object rather than the default string/buffer
        super({objectMode: true});
        this._storage = storage;
    }

    /**
     * Writes to storage using a StorageWriter.
     * @param {any} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} callback callback when finished writing jsonObj
     * @override
     */
    public _write(jsonObj: any, encoding: string, callback: Function): void
    {
        this._storage.Write("qa_builds_and_runs_from_bamboo", jsonObj);

        // callback signals successful writing of jsonObj,
        // ommit callback() to signal error,
        // or pass a parameter with any object/message to signal with an error
        callback();
    }
}