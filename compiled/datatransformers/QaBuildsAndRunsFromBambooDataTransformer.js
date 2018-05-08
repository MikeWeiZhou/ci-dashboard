"use strict";
exports.__esModule = true;
var QaBuildsAndRunsFromBambooDataTransformer = (function () {
    function QaBuildsAndRunsFromBambooDataTransformer() {
    }
    QaBuildsAndRunsFromBambooDataTransformer.prototype.Transform = function (o) {
        return {
            MINUTES_TOTAL_QUEUE_AND_BUILD: o.MINUTES_TOTAL_QUEUE_AND_BUILD,
            BUILD_COMPLETED_DATE: o.BUILD_COMPLETED_DATE,
            PLATFORM: o.BUILD_KEY.substring(9, 12),
            PRODUCT: o.BUILD_KEY.substring(13, 15),
            IS_MASTER: (o.BUILD_KEY.length == 18) ? 0 : 1,
            IS_SUCCESS: (o.BUILD_STATE == "Failed") ? 0 : 1
        };
    };
    return QaBuildsAndRunsFromBambooDataTransformer;
}());
exports["default"] = QaBuildsAndRunsFromBambooDataTransformer;
