import React, { Component } from 'react';
import Graph from '../Graph';

class QaOverall extends Component {
    // Data
    qa_overall_data = [{ 
        values: [ 607, 789 ], labels: [ 'Success', 'Fail' ], type: 'pie' 
    }];
    qa_overall_layout = { title: 'QA Overall Build Success vs Fail' };

    qa_platform_data = [{
        x: ['LIN', 'MAC', 'WIN'],
        y: [0.553, 0.342, 0.3424],
        type: 'bar'
    }];
    qa_platform_layout = { title: 'QA Platform Build Success Rate' };

    qa_product_data = [{
        x: ['DX', 'FX', 'IC', 'MX'],
        y: [0.3373, 0.4263, 0.45, 0.6061],
        type: 'bar'
    }];
    qa_product_layout = { title: 'QA Product Build Success Rate' };

    // Initial state of the component
    state = { 
        data: this.qa_platform_data, 
        layout: this.qa_platform_layout, 
        frames: [], 
        config: {} 
    };

    // Request data from API
    // componentDidMount() {
    //     fetch(url, {
    //         body: JSON.stringify(data), // must match 'Content-Type' header
    //         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: 'same-origin', // include, same-origin, *omit
    //         headers: {
    //           'user-agent': 'Mozilla/4.0 MDN Example',
    //           'content-type': 'application/json'
    //         },
    //         method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //         mode: 'cors', // no-cors, cors, *same-origin
    //         redirect: 'follow', // manual, *follow, error
    //         referrer: 'no-referrer', // *client, no-referrer
    //       }
    //     ).then(res => res.json())
    //     .then(json => this.setState({ data: json.data }));
    //   }
    
    render() {
        return (
            <div>
                <Graph data={this.state.data} layout={this.state.layout} />
                <br />
                <button className="btn btn-primary" onClick={() => this.changeData()}>Change data set</button>
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

export default QaOverall;
