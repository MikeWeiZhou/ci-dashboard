import { Transform } from "stream"
import { IDataTransformer } from "./IDataTransformer";

/**
 * TransformStream.
 * 
 * Transforms JSON objects using a given DataTransformer and pushes it down the pipeline.
 */
export class TransformStream extends Transform
{
    private _dataTransformer: IDataTransformer;

    /**
     * Constructor.
     * @param {IDataTransformer} dataTransformer DataTransformer used to transform the JSON object
     */
    public constructor(dataTransformer: IDataTransformer)
    {
        // objectMode: stream accepts any JS object rather than the default string/buffer
        super({objectMode: true});
        this._dataTransformer = dataTransformer;
    }

    /**
     * Transforms a JSON object using an DataTransformer.
     * @param {object} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} callback callback when finished transforming jsonObj
     * @override
     */
    public _transform(jsonObj: object, encoding: string, callback: Function): void
    {
        this.push(this._dataTransformer.Transform(jsonObj));

        // callback signals successful writing of jsonObj,
        // ommit callback() to signal error,
        // or pass a parameter with any object/message to signal with an error
        callback();
    }
}