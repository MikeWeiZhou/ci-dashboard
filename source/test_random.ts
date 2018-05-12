/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import * as fs from "fs"

// var st: any;

var kpilist: object = {};

generateKpiList();
function generateKpiList()
{
    var dirs: string[] = fs.readdirSync("./source/kpimappers");
    for (let dirname of dirs)
    {
        if (/\.ts$/.test(dirname))
        {
            continue;
        }

        kpilist[dirname] = {};
        let kpifilenames: string[] = fs.readdirSync(`./source/kpimappers/${dirname}`);
        for (let filename of kpifilenames)
        {
            if (!/\.ts$/.test(filename))
            {
                continue;
            }

            let name = filename.slice(0, -3); // remove extension
            let req = require(`./kpimappers/${dirname}/${name}`);
            kpilist[dirname][name] = new req[name]();
        }
    }
}