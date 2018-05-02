"use strict";
exports.__esModule = true;
var CsvDataReader_1 = require("./datareaders/CsvDataReader");
var InsuranceDataTransformer_1 = require("./datatransformers/InsuranceDataTransformer");
var TransformStream_1 = require("./TransformStream");
var MySqlStorageWriter_1 = require("./storagewriters/MySqlStorageWriter");
var dataCollector = new CsvDataReader_1.CsvDataReader("./data/FL_insurance_sample.csv");
var dataTransformer = new InsuranceDataTransformer_1.InsuranceDataTransformer();
var dataWriter = new MySqlStorageWriter_1.MySqlStorageWriter("localhost", "cidashboard", "root", "");
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
dataWriter.Cleanup();
