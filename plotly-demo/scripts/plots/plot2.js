// this format is fine too if using the same data from plot1
// doesn't work the other way around

// Change settings for the second layout 
// Such as title
var layout2 = {
	title: 'Plot 2',
	xaxis: {
        title: 'x Axis',
        fixedrange: true
	},
	yaxis: {
        title: 'y Axis',
        // Fixed range prevents the axis from getting moved
        fixedrange: true
	},
	shapes: [{
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: 12.0,
        x1: 1,
        y1: 12.0,
        line:{
            color: 'rgb(255, 0, 0)',
            width: 4,
            dash:'dot'
        }
    }]
	
};
// To display the second layout
Plotly.newPlot('tester2', data, layout2,{displayModeBar: false});