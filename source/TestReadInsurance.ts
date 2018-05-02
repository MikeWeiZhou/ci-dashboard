import { IDataReader } from "./datareaders/IDataReader"
import { IDataTransformer } from "./datatransformers/IDataTransformer"

import { CsvDataReader } from "./datareaders/CsvDataReader"
import { InsuranceDataTransformer } from "./datatransformers/InsuranceDataTransformer"

import { TransformStream } from "./TransformStream"
import * as csv from "csv-parse"
import * as fs from "fs"

const insuranceReader: IDataReader = new CsvDataReader("./data/FL_insurance_sample.csv");
const insuranceTransformer: IDataTransformer = new InsuranceDataTransformer();

var count: number = 0;

insuranceReader.GetStream()
    .pipe(new TransformStream(insuranceTransformer))
    .on('data', function (data: any) {
        if (count++ <= 1)
        {
            console.log(count);
            console.log(data);
        }
    });