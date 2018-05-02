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
     * @param {Function} callback callback when finished transforming jsonObj
     * @override
     */
    _transform(jsonObj: any, encoding: string, callback: Function): void
    {
        this.push(this._dataTransformer.Transform(jsonObj));

        // callback signals successful transformation of jsonObj
        // pass a parameter with any object to signal with an error msg
        callback();
    }
}