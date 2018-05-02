"use strict";
exports.__esModule = true;
var InsuranceDataTransformer = (function () {
    function InsuranceDataTransformer() {
    }
    InsuranceDataTransformer.prototype.Transform = function (o) {
        return {
            policy_id: o.policyID,
            site_deductable: o.eq_site_deductible
        };
    };
    return InsuranceDataTransformer;
}());
exports.InsuranceDataTransformer = InsuranceDataTransformer;
