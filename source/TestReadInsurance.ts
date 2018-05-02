import { IDataCollector } from "./datacollectors/IDataCollector"
import { IDataTransformer } from "./datatransformers/IDataTransformer"

import { CsvDataCollector } from "./datacollectors/CsvDataCollector"
import { InsuranceDataTransformer } from "./datatransformers/InsuranceDataTransformer"

import { TransformStream } from "./TransformStream"
import * as csv from "csv-parse"
import * as fs from "fs"

import { MySqlDataWriter } from "./datawriters/MySqlDataWriter";
import { WriteStream } from "./WriteStream";

const dataCollector: IDataCollector = new CsvDataCollector("./data/FL_insurance_sample.csv");
const dataTransformer: IDataTransformer = new InsuranceDataTransformer();
const dataWriter: MySqlDataWriter = new MySqlDataWriter("localhost", "cidashboard", "root", "");

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




// dataWriter.RawQuery("CREATE TABLE insurance (policy_id VARCHAR(255), site_deductable VARCHAR(255))");