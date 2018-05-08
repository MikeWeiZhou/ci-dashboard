// Plot 9 represents a might be test scenario
// Where it finds the number of manual builds happened per day
// Filtered by per platform
// Represented in a bar graph
// Uses the follwing fields: BUILD_KEY, CREATED_DATE, TRIGGER_REASON

var selectorOptions = {
    buttons: [{
		// The step is to specifiy by how much
		// Can choose from day,month,year
        step: 'day',
		
		// Stepmode can be backward or todate
		// backward is from the range selected
        stepmode: 'backward',
		
		// Count is by how much of that
        count: 1,
		
        label: '1D'
    }, {
        step: 'day',
        stepmode: 'backward',
        count: 2,
        label: '2D'
    }, {
        step: 'day',
        stepmode: 'backward',
        count: 4,
        label: '4D'
    }, {
        step: 'all',
		label: 'YTD',
    }],
};

var windows = {
    x: ['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    y: [5,2,3,4,7],
    name: 'Windows',
    type: 'line',
    mode: 'lines'
}

var linux = {
    x: ['2018-04-20','2018-04-21','2018-04-23','2018-04-25'],
    y: [7,3,1,5],
    name: 'Linux',
    type: 'line',
    mode: 'lines'
};

var mac = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    y:[2,5,2,4,5],
    name: 'Mac',
    type: 'line',
    mode: 'lines'
}

var movingAvg = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    y:[4.6,3.3,2.3,4,5.6],
    name: 'Average',
    mode: 'lines',
    type: 'line',
    line: {
        color: 'rgb(255, 0, 0)',
        width: 4,
        dash:'dot'
    }
}

var data = [windows,linux,mac,movingAvg];

var layout9 = {
    title: 'Number of builds per day',
    barmode: 'group',
    xaxis: {
        title: 'Date',
        rangeselector: selectorOptions,
        fixedrange: true
    },
    yaxis: {
        title: 'Builds',
        fixedrange: true
    },
    // DISABLE THE HOVERING OF DATA
    // Uncomment code below to disable
    hovermode: false
};

Plotly.newPlot('tester9', data, layout9, {displayModeBar: false});

