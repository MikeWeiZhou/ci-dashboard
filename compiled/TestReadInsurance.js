"use strict";
exports.__esModule = true;
var CsvDataCollector_1 = require("./datacollectors/CsvDataCollector");
var InsuranceDataTransformer_1 = require("./datatransformers/InsuranceDataTransformer");
var TransformStream_1 = require("./TransformStream");
var MySqlDataWriter_1 = require("./datawriters/MySqlDataWriter");
var dataCollector = new CsvDataCollector_1.CsvDataCollector("./data/FL_insurance_sample.csv");
var dataTransformer = new InsuranceDataTransformer_1.InsuranceDataTransformer();
var dataWriter = new MySqlDataWriter_1.MySqlDataWriter("localhost", "cidashboard", "root", "");
var count = 0;
dataCollector.Initialize();
dataWriter.Initialize();
dataCollector.GetStream()
    .pipe(new TransformStream_1.TransformStream(dataTransformer))
    .on('data', function (data) {
    if (count++ <= 1) {
        console.log(count);
        console.log(data);
    }
});
dataCollector.Cleanup();
