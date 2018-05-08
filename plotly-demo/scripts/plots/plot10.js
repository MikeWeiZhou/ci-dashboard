// Plot 10 represents a might be test scenario
// Where it finds on average how long it takes for a successful build to run 1 test
// Filtered by per platform per product
// Represented in a bar graph
// Uses the follwing fields: BUILD_KEY, BUILD_STATE, BUILD_DATE, TOTAL_TEST_DURATION, SUCCESS_TEST_COUNT

function msToSeconds(millis) {
    var minutes = millis/1000;
    return minutes;
}

var windows = {
    x: ['FX','MX','DX','IX'],
    y: [msToSeconds(1862),msToSeconds(891),msToSeconds(1435),msToSeconds(2142)],
    name: 'Windows',
    type: 'line'
}

var linux = {
    x: ['FX','MX','DX','IX'],
    y: [msToSeconds(2311),msToSeconds(536),msToSeconds(1431),msToSeconds(1843)],
    name: 'Linux',
    type: 'line'
};

var mac = {
    x:['FX','MX','DX','IX'],
    y:[msToSeconds(963),msToSeconds(743),msToSeconds(1023),msToSeconds(1673)],
    name: 'Mac',
    type: 'line'
}

var data = [windows,linux,mac];

var layout10 = {
    title: 'Average time per test',
    barmode: 'group',
    shapes: [{
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: 1,
        x1: 1,
        y1: 1,
        line:{
            color: 'rgb(255, 0, 0)',
            width: 4,
            dash:'dot'
        }
    }]
};

Plotly.newPlot('tester10', data, layout10, {displayModeBar: false});