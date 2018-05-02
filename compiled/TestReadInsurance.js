"use strict";
exports.__esModule = true;
var CsvDataReader_1 = require("./datareaders/CsvDataReader");
var InsuranceDataTransformer_1 = require("./datatransformers/InsuranceDataTransformer");
var TransformStream_1 = require("./TransformStream");
var insuranceReader = new CsvDataReader_1.CsvDataReader("./data/FL_insurance_sample.csv");
var insuranceTransformer = new InsuranceDataTransformer_1.InsuranceDataTransformer();
var transformStream = new TransformStream_1.TransformStream(insuranceTransformer);
var count = 0;
insuranceReader.GetStream()
    .pipe(transformStream)
    .on('data', function (data) {
    if (count++ <= 1) {
        console.log(count);
        console.log(data);
    }
});
