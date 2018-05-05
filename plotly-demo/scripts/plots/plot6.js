// Plot 6 represents a might be test scenario
// Between average time it takes to queue and successfully bulid for each platform
// Represnted in a Line graph
// Uses the following fields: MINUTES_TOTAL_QUEUE_AND_BUILD,BUILD_KEY,BUILD_STATE,BUILD_COMPLETED_DATE

// to edit the buttons here
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
        count: 3,
        label: '3D'
    }, {
        step: 'all',
		label: 'YTD',
    }],
};

var winData = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    // time in y is in ms, need to convert it to actual time
    y:[579,673,634,700,529],
    type: 'line',
    name: 'Windows'
};

var linData = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24'],
    y:[683,781,583,674],
    type: 'line',
    name: 'Linux'
};

var macData = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    y:[643,538,633,742,673,763],
    type: 'line',
    name: 'Mac'
}

var layout6 = {
    title: 'Number of builds vs time period with platforms',
    xaxis: {
        title: 'Date',
        rangeselector: selectorOptions,
        fixedrange: true
    },
    yaxis: {
        title: 'Compiled time in ms',
        fixedrange: true
    }
};

var data = [winData,linData,macData];

Plotly.newPlot('tester6', data, layout6, {displayModeBar: false});