"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var KpiMapper_1 = require("./KpiMapper");
var config = require("../../config/config");
var QaOverallBuildSuccessKpiMapper = (function (_super) {
    __extends(QaOverallBuildSuccessKpiMapper, _super);
    function QaOverallBuildSuccessKpiMapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tablename = config.db.tablename.qa_builds_and_runs_from_bamboo;
        _this._title = "QA Overall Build Success vs Fail";
        return _this;
    }
    QaOverallBuildSuccessKpiMapper.prototype.GetQueryString = function (from, to) {
        return "\n            SELECT COUNT(*) AS 'COUNT',\n                   IS_DEFAULT\n            FROM " + this._tablename + "\n            WHERE BUILD_COMPLETED_DATE BETWEEN '" + from + "' AND '" + to + "'\n            GROUP BY IS_DEFAULT\n        ";
    };
    QaOverallBuildSuccessKpiMapper.prototype.MapToKpiState = function (jsonArray) {
        var values = [];
        var labels = [];
        for (var i = 0; i < jsonArray.length; ++i) {
            values.push(jsonArray[i].COUNT);
            labels.push(jsonArray[i].IS_SUCCESS);
        }
        return {
            data: [{
                    values: values,
                    labels: labels,
                    type: "pie"
                }],
            layout: {
                title: this._title
            },
            frames: [],
            config: {}
        };
    };
    return QaOverallBuildSuccessKpiMapper;
}(KpiMapper_1.KpiMapper));
exports.QaOverallBuildSuccessKpiMapper = QaOverallBuildSuccessKpiMapper;
