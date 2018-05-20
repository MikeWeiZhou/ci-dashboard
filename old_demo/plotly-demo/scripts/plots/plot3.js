// Plot3.js is an example on how to get the date ranges

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
		
        label: '7D'
    }, {
        step: 'day',
        stepmode: 'backward',
        count: 30,
        label: '30D'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1Y'
    }, {
        step: 'all',
		label: 'YTD',
    }],
};

var data = [
    {
        // Data in the x axis has to be in asending order from date or else it'll look weird
      x: ['2013-10-04 22:23:00','2014-1-04 22:23:00','2015-3-04 22:23:00'],
      y: [1, 10, 100],
      type: 'scatter'
    }
  ];

var layout3 = {
    title: 'Plot 3',
    xaxis: {
        rangeselector: selectorOptions,
        // Change the range of the dates from one point to another
        range: ['2014-01-01', '2015-03-31'],
        // rangeslider allows user to drag the field if wanted,
        // uncomment to add a rangeslider
        // rangeslider: {},
        fixedrange: true
    },
    yaxis: {
        // Fixed range prevents the axis from getting moved
        fixedrange: true
    }
};
// To display the fourth layout
Plotly.newPlot('tester3', data, layout3, {displayModeBar: false});