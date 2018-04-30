// Probably the proper way of having data
var trace1 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  name: 'Name of Trace 1',
  type: 'scatter'
};
var trace2 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [1, 0, 3, 2, 5, 4, 7, 6, 8],
  name: 'Name of Trace 2',
  type: 'scatter'
};
var data = [trace1, trace2];

var layout1 = {
  title: 'Plot 1',
  xaxis: {
    title: 'x Axis',
    titlefont: {
      family: 'Courier New, monospace',
      size: 18,
      color: '#7f7f7f'
    }
  },
  yaxis: {
    title: 'y Axis',
    titlefont: {
      family: 'Courier New, monospace',
      size: 18,
      color: '#7f7f7f'
    }
  }
};
// To display the first plot using the first layout
Plotly.newPlot('tester1', data, layout1);

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

// Change settings for the second layout
var layout3 = {
	title: 'Plot 3'
};
// To display the third layout
Plotly.newPlot('tester3', data, layout3);

// Change settings for the second layout
var layout4 = {
	title: 'Plot 4'
};
// To display the fourth layout
Plotly.newPlot('tester4', data, layout4);