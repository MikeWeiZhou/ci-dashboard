// this format is fine too if using the same data from plot1
// doesn't work the other way around

// Change settings for the second layout 
// Such as title
var layout2 = {
	title: 'Plot 2',
	xaxis: {
		title: 'x Axis'
	},
	yaxis: {
		title: 'y Axis'
	}
};
// To display the second layout
Plotly.newPlot('tester2', data, layout2);