import * as moment from "moment"

var newdate: Date = new Date("2018-01-25");

var amoment: string = moment(newdate).format("YYYY-MM-DD HH:mm:ss");

console.log(newdate.toString());
console.log(amoment);
