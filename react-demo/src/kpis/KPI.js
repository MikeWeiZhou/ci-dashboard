import React, { Component } from 'react';
import Graph from '../Graph';

class KPI extends Component {
    // Data
    // qa_overall_data = [{ 
    //     values: [ 607, 789 ], labels: [ 'Success', 'Fail' ], type: 'pie' 
    // }];
    // qa_overall_layout = { title: 'QA Overall Build Success vs Fail' };

    // qa_platform_data = [{
    //     x: ['LIN', 'MAC', 'WIN'],
    //     y: [0.553, 0.342, 0.3424],
    //     type: 'bar'
    // }];
    // qa_platform_layout = { title: 'QA Platform Build Success Rate' };

    // qa_product_data = [{
    //     x: ['DX', 'FX', 'IC', 'MX'],
    //     y: [0.3373, 0.4263, 0.45, 0.6061],
    //     type: 'bar'
    // }];
    // qa_product_layout = { title: 'QA Product Build Success Rate' };

    // Initial state of the component
    state = { 
        data: [], 
        layout: {}, 
        frames: [], 
        config: {} 
    };

    //Request data from API
    componentDidMount() {
        // Define the route here
        var url = `getkpi/${this.props.route}/${this.props.startDate}/${this.props.endDate}`;
        // GET request to retrieve data
        fetch(url
        ).then(res => res.json())
        .then(jsonResponse => this.setState({ 
                                                data: jsonResponse.data,
                                                layout: jsonResponse.layout,
                                                frames: jsonResponse.frames,
                                                config: jsonResponse.config
                                            }));
    }
    
    render() {
        return (
            <div>
                <Graph data={this.state.data} layout={this.state.layout} frames={this.state.frames} config={this.state.config}/>
                <br />
                {/* <button className="btn btn-primary" onClick={() => this.changeData()}>Change data set</button> */}
            </div>
        );
    }

    // changeData() {
    //     if (this.state.data === this.qa_platform_data)
    //       this.setState({data: this.qa_product_data, layout: this.qa_product_layout});
    //     else
    //       this.setState({data: this.qa_platform_data, layout: this.qa_platform_layout});
    // }
}

export default KPI;
