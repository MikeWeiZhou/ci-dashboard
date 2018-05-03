/**
 * IDataTransformer.
 * 
 * Performs a transformation on a JSON object.
 */
export default interface IDataTransformer
{
    /**
     * Returns a transformed JSON object.
     * @param {any} o original JSON object
     * @returns {any} transformed JSON object
     */
    Transform(o: any): any;
}