// Plot 8 represents a might be test scenario
// Where it finds the average time it takes to process a sucessful build
// Filtered by per platform per product
// Represented in a bar graph
// Uses the follwing fields: BUILD_KEY, DURATION or PROCESSING_DURATION
// DURATION or PROCESSING_DURATION field number is represnted in ms 

var windows = {
    x: ['FX','MX','DX','IX'],
    y: [msToHours(1894764),msToHours(4280772),msToHours(14135028),msToHours(6183724)],
    name: 'Windows',
    type: 'bar'
}

var linux = {
    x: ['FX','MX','DX','IX'],
    y: [msToHours(6002681),msToHours(51888776),msToHours(32213758),msToHours(65163312)],
    name: 'Linux',
    type: 'bar'
};

var mac = {
    x:['FX','MX','DX','IX'],
    y:[msToHours(5970460),msToHours(19740846),msToHours(15917696),msToHours(24557626)],
    name: 'Mac',
    type: 'bar'
}

var avg = {
    x:['FX','MX','DX','IX'],
    y:[msToHours(3570460),msToHours(17404641),msToHours(9917696),msToHours(1257626)],
    name: 'Average',
    type: 'line',
    line: {
        color: 'rgb(255, 0, 0)',
        width: 4,
        dash:'dot'
    }
}

var data = [windows,linux,mac,avg];

var layout8 = {
    title: 'Average time it takes per platform per product to build',
    barmode: 'group',
    xaxis: {
        title: 'Products'
    },
    yaxis: {
        title: 'Hours'
    },
    shapes: [{
        type: 'line',
        xref: 'paper',
        // The x0 and y0 needs to be 0 
        x0: 0,
        y0: 0,
        x1: 0.5,
        y1: 20,
        line:{
            color: 'rgb(255, 0, 0)',
            width: 4,
            dash:'dot'
            }
        },
        {
            type: 'line',
            xref: 'paper',
            // The x0 and y0 needs to be 0 
            x0: 0.5,
            y0: 20,
            x1: 1,
            y1: 10,
            line:{
                color: 'rgb(255, 0, 0)',
                width: 4,
                dash:'dot'
            }
    }]
};

Plotly.newPlot('tester8', data, layout8, {displayModeBar: false});

