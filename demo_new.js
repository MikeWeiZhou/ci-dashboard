var fs = require("fs")

var dir = "./source/kpimappers/New_Category";
var f1 = "A_AveragedBuildTimeKpiMapper.ts";
var f2 = "B_RawBuildTimeKpiMapper.ts";

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.createReadStream(`./${f1}`).pipe(fs.createWriteStream(`${dir}/${f1}`));
fs.createReadStream(`./${f2}`).pipe(fs.createWriteStream(`${dir}/${f2}`));