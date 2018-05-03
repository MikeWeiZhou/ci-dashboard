/**
 * IDataTransformer.
 * 
 * Returns a transformed and sanitized JSON object.
 */
export default interface IDataTransformer
{
    /**
     * Returns a transformed and sanitized JSON object.
     * @param {any} o original JSON object
     * @returns {any} a transformed JSON object
     */
    Transform(o: any): any;
}