import React, { Component } from 'react';
import Graph from '../Graph';

class KPI extends Component {
    // Initial state of the component
    state = { 
        data: [], 
        layout: {}, 
        frames: [], 
        config: {} 
    };

    // Requests data from API
    requestData() {
        // Construct route
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

    //Called after component is mounted
    componentDidMount() {
        this.requestData();
    }

    //Called after component is updated    
    componentDidUpdate(prevProps) {
        // Only request data if props is updated
        if (prevProps !== this.props)
            this.requestData();        
    }
    
    render() {
        return (
            <div className="kpi">
                <Graph data={this.state.data} layout={this.state.layout} frames={this.state.frames} config={this.state.config}/>
            </div>
        );
    }
}

export default KPI;
