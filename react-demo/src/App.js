import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Plot from 'react-plotly.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.data1 = [{
      x: [1, 2, 3],
      y: [2, 6, 3],
      type: 'scatter',
      mode: 'lines+points',
      marker: {color: 'red'},
    },
    {
      type: 'bar', 
      x: [1, 2, 3], 
      y: [2, 5, 3]
    }];
  
    // this.data2 = [{
    //   x: [1, 2, 3],
    //   y: [4, 2, 7],
    //   type: 'scatter',
    //   mode: 'lines+points',
    //   marker: {color: 'red'},
    // },
    // {
    //   type: 'bar', 
    //   x: [1, 2, 3], 
    //   y: [7, 2, 5]
    // }];

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
    this.data2 = [trace1, trace2];
    
    this.layout1 = {
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

    this.layout2 = {
      title: 'A Fancy Plot'}
    this.state = { data: this.data1, 
                    layout: this.layout1, 
                    frames: [], 
                    config: {} 
                  };
    this.data3 = [{
      values:[19,26,100],
      labels:['Residential', 'Non-Residential', 'Utility'],
      type: 'pie'
    }]
    
    this.layout3 = {
      title: 'Plot 4'
    };
  }

  render() {    
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <Plot
              data={this.state.data}
              layout={this.state.layout}
              frames={this.state.frames}
              config={this.state.config}
              onInitialized={(figure) => this.setState(figure)}
              onUpdate={(figure) => this.setState(figure)}
          />
        <button onClick={() => this.changeData()}>Change data set</button>
      </div>
    );
  }

  changeData() {
    if (this.state.data === this.data1)
      this.setState({data: this.data3, layout: this.layout3});
    else
      this.setState({data: this.data1, layout: this.layout1});
  }
}

export default App;
