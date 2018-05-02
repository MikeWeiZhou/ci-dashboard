import { Transform } from "stream"
import { IDataTransformer } from "./datatransformers/IDataTransformer";

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
    constructor(dataTransformer: IDataTransformer)
    {
        super({
            objectMode: true // stream accepts any JS object rather than the default string/buffer
        });

        this._dataTransformer = dataTransformer;
    }

    /**
     * Transforms a JSON object using an DataTransformer.
     * @param {any} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} callback optional callback when stream is finished
     */
    _transform(jsonObj: any, encoding: string, callback: Function): void
    {
        this.push(this._dataTransformer.Transform(jsonObj));
        callback();
    }
}