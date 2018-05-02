import { IDataTransformer } from "./IDataTransformer"

/**
 * InsuranceDataTransformer.
 * 
 * Returns only the Policy ID and Site Deductable of each insurance record.
 */
export class InsuranceDataTransformer implements IDataTransformer
{
    constructor()
    {
    }

    /**
     * Returns only the Policy ID and Site Deductable of each insurance record.
     * @param {any} o original JSON insurance record
     * @returns {any} a transformed JSON insurance record
     * @override
     */
    Transform(o: any): any
    {
        return {
            policy_id: o.policyID,
            site_deductable: o.eq_site_deductible
        };
    }
}