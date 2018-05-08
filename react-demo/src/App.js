import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Plot from 'react-plotly.js';

class App extends Component {
  constructor(props) {
    super(props);
    // this.data1 = [{
    //   x: [1, 2, 3],
    //   y: [2, 6, 3],
    //   type: 'scatter',
    //   mode: 'lines+points',
    //   marker: {color: 'red'},
    // },
    // {
    //   type: 'bar', 
    //   x: [1, 2, 3], 
    //   y: [2, 5, 3]
    // }];
  
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

    // var trace1 = {
    //   x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //   y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //   name: 'Name of Trace 1',
    //   // type is defaulted to scatter
    //   type: 'scatter'
    // };
    // var trace2 = {
    //   x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //   y: [1, 0, 3, 2, 5, 4, 7, 6, 8],
    //   name: 'Name of Trace 2',
    //   // to change the type, change it here
    //   // Types that can be changed are the followings
    //   // scatter, bar, pie, 
    //   type: 'scatter'
    // };
    // this.data2 = [trace1, trace2];
    
    // this.layout1 = {
    //   // Chart title here
    //   title: 'Plot 1',
    //   xaxis: {
    //    // Can change title of the x axis here
    //     title: 'x Axis',
    //   // If want to change font in any way from the axis name
    //     titlefont: {
    //       family: 'Courier New, monospace',
    //       size: 18,
    //       color: '#7f7f7f'
    //     }
    //   },
    //   yaxis: {
    //     title: 'y Axis',
    //     titlefont: {
    //       family: 'Courier New, monospace',
    //       size: 18,
    //       color: '#7f7f7f'
    //     }
    //   }
    // };

    // this.layout2 = {
    //   title: 'A Fancy Plot'}

    // this.data3 = [{
    //   values:[19,26,100],
    //   labels:['Residential', 'Non-Residential', 'Utility'],
    //   type: 'pie'
    // }]
    
    // this.layout3 = {
    //   title: 'Plot 4'
    // };










    this.qa_overall_data = [ { values: [ 607, 789 ], labels: [ 'Success', 'Fail' ], type: 'pie' } ];
    this.qa_overall_layout = { title: 'QA Overall Build Success vs Fail' };

    this.qa_platform_data = [{
          x: ['LIN', 'MAC', 'WIN'],
          y: [0.553, 0.342, 0.3424],
          type: 'bar'
      }];
    this.qa_platform_layout = { title: 'QA Platform Build Success Rate' };


    this.qa_product_data = [{
      x: ['DX', 'FX', 'IC', 'MX'],
      y: [0.3373, 0.4263, 0.45, 0.6061],
      type: 'bar'
    }];
    this.qa_product_layout = { title: 'QA Product Build Success Rate' };

    // Build success rate for each product by platform (grouped bar graph)
    var dx = {
      x: ['LIN', 'MAC', 'WIN'],
      y: [0.4414, 0.3434, 0.2056],
      name: 'DX',
      type: 'bar'
    }

    var fx = {
      x: ['LIN', 'MAC', 'WIN'],
      y: [0.6389, 0.3559, 0.2024],
      name: 'FX',
      type: 'bar'
    }

    var ic = {
      x: ['LIN', 'MAC', 'WIN'],
      y: [0.4686, 0.3827, 0.4677],
      name: 'IC',
      type: 'bar'
    }

    var mx = {
      x: ['LIN', 'MAC', 'WIN'],
      y: [0.8333, 0.2794, 0.5795],
      name: 'MX',
      type: 'bar'
    }
  
    // var target = {
    //   y: [0.9],
    //   name: 'Build success target',
    //   type: 'scatter',
    //   modes: 'lines'
    // }

    this.qa_platform_successrate_per_product_data = [dx, fx, ic, mx];
    this.qa_platform_successrate_per_product_layout = {
                                                      title: 'QA Build success rate of products per platform', 
                                                      barmode: 'group',
                                                      shapes: [{
                                                            type: 'line',
                                                            xref: 'paper',
                                                            x0: 0,
                                                            y0: 0.60,
                                                            x1: 1,
                                                            y1: 0.60,
                                                            line:{
                                                                color: 'rgb(255, 0, 0)',
                                                                width: 4,
                                                                dash:'dot'
                                                            }
                                                        }]
                                                    };

    this.state = { data: this.qa_platform_data, 
      layout: this.qa_platform_layout, 
      frames: [], 
      config: {} 
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
              data={this.qa_overall_data}
              layout={this.qa_overall_layout}
          />
          <br />
        <Plot
            data={this.state.data}
            layout={this.state.layout}
            onInitialized={(figure) => this.setState(figure)}
            onUpdate={(figure) => this.setState(figure)}
        />
        <br />
        <button className="btn btn-primary" onClick={() => this.changeData()}>Change data set</button>
        <br />
        <Plot
              data={this.qa_platform_successrate_per_product_data}
              layout={this.qa_platform_successrate_per_product_layout}
          />
      </div>
    );
  }

  changeData() {
    if (this.state.data === this.qa_platform_data)
      this.setState({data: this.qa_product_data, layout: this.qa_product_layout});
    else
      this.setState({data: this.qa_platform_data, layout: this.qa_platform_layout});
  }
}

export default App;
