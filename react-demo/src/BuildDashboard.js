import React, { Component } from 'react';
import KPI from './kpis/KPI';

class BuildDashboard extends Component {
    state = {
        // Define API routes here for testing
        routes: [
            "qa/overall_builds_success",
            ,"qa/build_success_rate_per_platform_per_product"
            ,"qa/build_success_rate_per_platform"
            ,"qa/build_success_rate_per_product"
            ,"qa/build_success_rate"
        ],
        startDate: "2017-01-01",
        endDate: "2018-01-01"
    };

    render() {
        var elements = [];
        this.state.routes.forEach(element => {
            elements.push(<KPI route={element} startDate={this.state.startDate} endDate={this.state.endDate} />)
            elements.push(<br />);
        });

        return (
            <div className="Build">
                {elements}
            </div>
        );
    }
}

export default BuildDashboard;