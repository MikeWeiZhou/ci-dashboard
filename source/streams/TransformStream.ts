import { Transform } from "stream"
import { IDataInterface } from "../datainterfaces/IDataInterface";

/**
 * TransformStream.
 * 
 * Transforms JSON objects using a given DataInterface and pushes it down the pipeline.
 */
export class TransformStream extends Transform
{
    private _dataInterface: IDataInterface;

    /**
     * Constructor.
     * @param {IDataInterface} dataInterface IDataInterface used to transform the JSON object
     */
    public constructor(dataInterface: IDataInterface)
    {
        // objectMode: stream accepts any JS object rather than the default string/buffer
        super({objectMode: true});
        this._dataInterface = dataInterface;
    }

    /**
     * Transforms a JSON object using an IDataInterface.
     * @param {object} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} callback callback when finished transforming jsonObj
     * @override
     */
    public _transform(jsonObj: object, encoding: string, callback: Function): void
    {
        this.push(this._dataInterface.Transform(jsonObj));

        // callback signals successful writing of jsonObj,
        // ommit callback() to signal error,
        // or pass a parameter with any object/message to signal with an error
        callback();
    }
}