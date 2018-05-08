"use strict";
exports.__esModule = true;
var config = require("../../config/config");
var QaBuildsAndRunsFromBambooDataInterface = (function () {
    function QaBuildsAndRunsFromBambooDataInterface() {
        this.TableName = config.db.tablename.qa_builds_and_runs_from_bamboo;
        this.TableColumns = ["BUILDRESULTSUMMARY_ID", "MINUTES_TOTAL_QUEUE_AND_BUILD", "BUILD_COMPLETED_DATE", "CYCLE", "PLATFORM", "PRODUCT", "IS_DEFAULT", "IS_SUCCESS", "BRANCH_ID"];
        this._NO_BRANCH_ID = -1;
    }
    QaBuildsAndRunsFromBambooDataInterface.prototype.Transform = function (o) {
        return [
            o.BUILDRESULTSUMMARY_ID,
            o.MINUTES_TOTAL_QUEUE_AND_BUILD,
            o.BUILD_COMPLETED_DATE,
            o.BUILD_KEY.substring(0, 6),
            o.BUILD_KEY.substring(9, 12),
            o.BUILD_KEY.substring(13, 15),
            (o.BUILD_KEY.length > 17) ? 0 : 1,
            (o.BUILD_STATE == "Failed") ? 0 : 1,
            (o.BUILD_KEY.length > 17) ? o.BUILD_KEY.substring(17) : this._NO_BRANCH_ID
        ];
    };
    return QaBuildsAndRunsFromBambooDataInterface;
}());
exports.QaBuildsAndRunsFromBambooDataInterface = QaBuildsAndRunsFromBambooDataInterface;
