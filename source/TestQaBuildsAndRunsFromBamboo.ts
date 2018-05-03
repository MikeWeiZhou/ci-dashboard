/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import * as csv from "csv-parse"
import * as fs from "fs"

import IDataReader from "./datareaders/IDataReader"
import JsonDataReader from "./datareaders/JsonDataReader"

import IDataTransformer from "./datatransformers/IDataTransformer"
import QaBuildsAndRunsFromBambooDataTransformer from "./datatransformers/QaBuildsAndRunsFromBambooDataTransformer"

import IStorageReader from "./storagereaders/IStorageReader";
import MySqlStorageReader from "./storagereaders/MySqlStorageReader";

import IStorageWriter from "./storagewriters/IStorageWriter";
import MySqlStorageWriter from "./storagewriters/MySqlStorageWriter";

import IKpi from "./kpis/IKpi"
import QaOverallBuildSuccessKpi from "./kpis/QaOverallBuildSuccessKpi"

import TransformStream from "./TransformStream"
import WriteStream from "./WriteStream";

// CreateTable();
function CreateTable()
{
    const mysqlStorageWriter: MySqlStorageWriter = new MySqlStorageWriter("localhost", "cidashboard", "root", "");
    mysqlStorageWriter.RawQuery("DROP TABLE qa_builds_and_runs_from_bamboo;");
    mysqlStorageWriter.RawQuery
    (`
        CREATE TABLE qa_builds_and_runs_from_bamboo
        (
            MINUTES_TOTAL_QUEUE_AND_BUILD   INT,
            BUILD_COMPLETED_DATE            DATETIME,
            PLATFORM                        CHAR(3),
            PRODUCT                         CHAR(2),
            IS_MASTER                       TINYINT(1),
            IS_SUCCESS                      TINYINT(1)
        );
    `);
}

// ReadTransformAndSaveData();
function ReadTransformAndSaveData()
{
    const dataReader: IDataReader = new JsonDataReader("./data/qa_builds_and_runs_from_bamboo.json", "*");
    const dataTransformer: IDataTransformer = new QaBuildsAndRunsFromBambooDataTransformer();
    const storageWriter: IStorageWriter = new MySqlStorageWriter("localhost", "cidashboard", "root", "");

    dataReader.Initialize();
    storageWriter.Initialize();
    dataReader.GetStream()
        .pipe(new TransformStream(dataTransformer))
        .pipe(new WriteStream(storageWriter))
        .on('finish', function() {
            dataReader.Cleanup();
            storageWriter.Cleanup();
        });
}

ReadStorageAndConvertToKpi();
async function ReadStorageAndConvertToKpi(): Promise<any>
{
    const kpi: IKpi = new QaOverallBuildSuccessKpi();
    kpi.GetPlotlyState();

    // const mysqlStorageReader: MySqlStorageReader = new MySqlStorageReader("localhost", "cidashboard", "root", "");
    // const results: Promise<any> = await mysqlStorageReader.QueryOrNull("SELECT * FROM qa_builds_and_runs_from_bamboo limit 5;");
    // console.log(results);
}