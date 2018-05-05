// This script will represent a might be test scenerio
// Between number of builds during time period with platforms
// Represnted in a Line graph
// Uses the following fields : CREATED_DATE and BUILD_KEY

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
    y:[11,4,14,11,3],
    type: 'line',
    name: 'Windows'
};

var linData = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    y:[12,6,17,9,1],
    type: 'line',
    name: 'Linux'
};

var macData = {
    x:['2018-04-20','2018-04-21','2018-04-23','2018-04-24','2018-04-25'],
    y:[6,7,9,10,2],
    type: 'line',
    name: 'Mac'
}

var layout5 = {
    title: 'Number of builds vs time period with platforms',
    xaxis: {
        title: 'Date',
        rangeselector: selectorOptions,
        fixedrange: true,
        titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
        }
    },
    yaxis: {
        title: 'Number of Builds',
        fixedrange: true,
        titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
        }
    }
};

var data = [winData,linData,macData];

Plotly.newPlot('tester5', data, layout5, {displayModeBar: false});