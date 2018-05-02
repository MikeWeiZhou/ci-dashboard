import { IDataReader } from "./datareaders/IDataReader"
import { IDataTransformer } from "./datatransformers/IDataTransformer"

import { CsvDataReader } from "./datareaders/CsvDataReader"
import { InsuranceDataTransformer } from "./datatransformers/InsuranceDataTransformer"

import { TransformStream } from "./TransformStream"
import * as csv from "csv-parse"
import * as fs from "fs"

import { MySqlStorageWriter } from "./storagewriters/MySqlStorageWriter";
import { WriteStream } from "./WriteStream";

const dataCollector: IDataReader = new CsvDataReader("./data/FL_insurance_sample.csv");
const dataTransformer: IDataTransformer = new InsuranceDataTransformer();
const dataWriter: MySqlStorageWriter = new MySqlStorageWriter("localhost", "cidashboard", "root", "");

var count: number = 0;

dataCollector.Initialize();
dataWriter.Initialize();

dataCollector.GetStream()
    .pipe(new TransformStream(dataTransformer))
    // .pipe(new WriteStream(dataWriter))
    .on('data', function (data: any) {
        if (count++ <= 1)
        {
            console.log(count);
            console.log(data);
        }
    });

dataCollector.Cleanup();
dataWriter.Cleanup();




// dataWriter.RawQuery("CREATE TABLE insurance (policy_id VARCHAR(255), site_deductable VARCHAR(255))");