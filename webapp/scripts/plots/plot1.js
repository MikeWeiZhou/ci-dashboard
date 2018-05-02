// Probably the proper way of having data
// More of the library documentation here
// https://plot.ly/javascript/

var trace1 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  name: 'Name of Trace 1',
  // type is defaulted to scatter
  type: 'scatter'
};
var trace2 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [1, 0, 3, 2, 5, 4, 7, 6, 8],
  name: 'Name of Trace 2',
  // to change the type, change it here
  // Types that can be changed are the followings
  // scatter, bar, pie, 
  type: 'scatter'
};
var data = [trace1, trace2];

var layout1 = {
	// Chart title here
  title: 'Plot 1',
  xaxis: {
	 // Can change title of the x axis here
    title: 'x Axis',
	// If want to change font in any way from the axis name
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
// Fourth parameter hides the toolbar
Plotly.newPlot('tester1', data, layout1, {displayModeBar: false});