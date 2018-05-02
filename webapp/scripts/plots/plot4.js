// Change settings for the second layout
var data = [{
	values:[19,26,55],
	labels:['Residential', 'Non-Residential', 'Utility'],
	type: 'pie'
}]

var layout4 = {
	title: 'Plot 4'
};
// To display the fourth layout
Plotly.newPlot('tester4', data, layout4, {displayModeBar: false});