// Probably the proper way of having data
// More of the library documentation here
// https://plot.ly/javascript/

// This is an example of a scatter graph

var trace1 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  name: 'Name of Trace 1',
  // type is defaulted to scatter with lines
  type: 'scatter',
  mode: 'lines'
};
var trace2 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [1, 0, 3, 2, 5, 4, 7, 6, 8],
  name: 'Name of Trace 2',
  // to change the type, change it here
  // Types that can be changed are the followings
  // scatter, bar, pie, 
  type: 'scatter',
  mode: 'lines'
};
var data = [trace1, trace2];

var trace3 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  name: 'Name of Trace 1',
  // type is defaulted to scatter
  type: 'scatter',
    // changes to what kind of scatter to do
  // Can choose between markers,lines,scatter + lines
  mode:'markers'
  // marker has an extra paramter to change color/size
};
var trace4 = {
  x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  y: [1, 0, 3, 2, 5, 4, 7, 6, 8],
  name: 'Name of Trace 2',
  // to change the type, change it here
  // Types that can be changed are the followings
  // scatter, bar, pie, 
  type: 'scatter',
  mode:'markers'
};
var data2 = [trace3, trace4];

var layout1 = {
	// Chart title here
  title: 'Build Success Rate (avg all products and platforms)',
  xaxis: {
	 // Can change title of the x axis here
    title: 'Date',
  // If want to change font in any way from the axis name
  fixedrange: true,
    titlefont: {
      family: 'Courier New, monospace',
      size: 18,
      color: '#7f7f7f'
    }
  },
  yaxis: {
    title: 'Percentage',
    fixedrange: true,
    titlefont: {
      family: 'Courier New, monospace',
      size: 18,
      color: '#7f7f7f'
    }
  }
};
// To display the first plot using the first layout
// Fourth parameter hides the toolbar
Plotly.newPlot('tester1', data2, layout1, {displayModeBar: false});