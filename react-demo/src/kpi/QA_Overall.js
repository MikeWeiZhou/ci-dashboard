import React, { Component } from 'react';
import Graph from '../Graph';

class QA_Overall extends Component {
    // Hard coded state
    state = { 
        data: [{ values: [ 607, 789 ], labels: [ 'Success', 'Fail' ], type: 'pie' }], 
        layout: [{ title: 'QA Overall Build Success vs Fail' }], 
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
            </div>
        );
    }
}

export default QA_Overall;
