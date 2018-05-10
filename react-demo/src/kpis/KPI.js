import React, { Component } from 'react';
import Graph from '../Graph';

class KPI extends Component {
    // Initial state of the component
    state = { 
        data: [], 
        layout: {}, 
        frames: [], 
        config: {
            displayModBar: false
        } 
    };

    // Called after component is mounted
    componentDidMount() {
        this.requestData();
    }

    // Called after component is updated    
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

    // Requests data from API
    async requestData() {
        // Construct route
        var url = `getkpi/${this.props.route}/${this.props.startDate}/${this.props.endDate}`;

        try{
            // GET request to retrieve data
            var res = await fetch(url);

            // Set state if response is OK
            if (res.ok) {
                var resJSON = await res.json();
                this.setState({ 
                    data: resJSON.data,
                    layout: resJSON.layout,
                    frames: resJSON.frames,
                    config: resJSON.config
                });
            // Log error and display it on graph if response is not OK
            } else if (res.status == 404) {
                var resText = await res.text();
                this.setState({ 
                    data: [],
                    layout: {
                        title: resText,
                        titlefont: {
                            color: "red"
                        }
                    },
                    frames: [],
                    config: {}
                });
                console.log(`Failed request - url: ${res.url}, status: ${res.status}, body: ${resText}`);
            } else {
                var resText = await res.text();
                this.setState({ 
                    data: [],
                    layout: {
                        title: res.name,
                        titlefont: {
                            color: "red"
                        }
                    },
                    frames: [],
                    config: {}
                });
                console.log(`Failed request - url: ${res.url}, status: ${res.status}, body: ${resText}`);
            }
        } catch(error) {
            console.log(error.message);
        }
    }
}

export default KPI;
