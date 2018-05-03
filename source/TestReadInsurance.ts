import * as csv from "csv-parse"
import * as fs from "fs"

import IDataReader from "./datareaders/IDataReader"
import CsvDataReader from "./datareaders/CsvDataReader"

import IDataTransformer from "./datatransformers/IDataTransformer"
import InsuranceDataTransformer from "./datatransformers/InsuranceDataTransformer"

import IStorageWriter from "./storagewriters/IStorageWriter";
import MySqlStorageWriter from "./storagewriters/MySqlStorageWriter";

import TransformStream from "./TransformStream"
import WriteStream from "./WriteStream";

const dataReader: IDataReader = new CsvDataReader("./data/FL_insurance_sample.csv");
const dataTransformer: IDataTransformer = new InsuranceDataTransformer();
const storageWriter: IStorageWriter = new MySqlStorageWriter("localhost", "cidashboard", "root", "");

var count: number = 0;

dataReader.Initialize();
storageWriter.Initialize();

dataReader.GetStream()
    .pipe(new TransformStream(dataTransformer))
    .pipe(new WriteStream(storageWriter))
    // .on('data', function(data: any) {
    //     if (count++ <= 1)
    //     {
    //         console.log(count);
    //         console.log(data);
    //     }
    // })
    .on('finish', function() {
        dataReader.Cleanup();
        storageWriter.Cleanup();
    });

// storageWriter.RawQuery("DROP TABLE insurance IF EXISTS");
// storageWriter.RawQuery("CREATE TABLE insurance (policy_id VARCHAR(255), site_deductable VARCHAR(255))");
