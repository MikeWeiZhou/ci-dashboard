// Plot 7 represents a might be test scenario
// Where it finds the average time it takes to fix the build
// Based on each product and platforms
// Represented in a bar graph
// Uses the follwing fields: BUILD_KEY, TIME_TO_FIX
// TIME_TO_FIX Field number is represnted in ms

// This converts the msed data to hours
function msToHours(millis) {
    var minutes = Math.floor(millis/60000);
    var hour = Math.ceil(minutes/60);
    return hour;
}

var windows = {
    x: ['FX','MX','DX','IX'],
    y: [msToHours(1094480000),msToHours(1043389000),msToHours(39498000),msToHours(192456000)],
    name: 'Windows',
    type: 'bar'
}

var linux = {
    x: ['FX','MX','DX','IX'],
    y: [msToHours(1741951000),msToHours(844810000),msToHours(431866500),msToHours(5374000)],
    name: 'Linux',
    type: 'bar'
};

var mac = {
    x:['FX','MX','DX','IX'],
    y:[msToHours(54520000),msToHours(54520000),msToHours(85974000),msToHours(1477144000)],
    name: 'Mac',
    type: 'bar'
}

var data = [windows,linux,mac];

var layout7 = {
    title: 'Average time in hours to fix a build',
    barmode: 'group',
    shapes: [{
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: 500,
        x1: 1,
        y1: 500,
        line:{
            color: 'rgb(255, 0, 0)',
            width: 4,
            dash:'dot'
        }
    }]
};

Plotly.newPlot('tester7', data, layout7, {displayModeBar: false});