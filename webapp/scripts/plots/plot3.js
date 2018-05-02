// Plot3.js is an example on how to get the date ranges

var rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv';
var xField = 'Date';
var yField = 'Mean_TemperatureC';

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
        count: 7,
		
        label: '7d'
    }, {
        step: 'day',
        stepmode: 'backward',
        count: 30,
        label: '30d'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
		label: 'max',
    }],
};

Plotly.d3.csv(rawDataURL, function(err, rawData) {
    if(err) throw err;

    var data = prepData(rawData);
    var layout = {
        title: 'Plot 3',
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            fixedrange: true
        }
    };

    Plotly.plot('tester3', data, layout);
});

function prepData(rawData) {
    var x = [];
    var y = [];

    rawData.forEach(function(datum, i) {

        x.push(new Date(datum[xField]));
        y.push(datum[yField]);
    });

    return [{
        mode: 'lines',
        x: x,
        y: y
    }];
}