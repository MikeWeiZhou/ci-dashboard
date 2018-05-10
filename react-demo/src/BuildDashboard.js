import React, { Component } from 'react';
import KPI from './kpis/KPI';

class BuildDashboard extends Component {
    state = {
        // Define API routes here for testing
        routes: [
            "qa/overall_builds_success"
            ,"qa/build_success_rate_per_platform_per_product"
            ,"qa/build_success_rate_per_platform"
            ,"qa/build_success_rate_per_product"
            ,"qa/build_success_rate"
            ,"defects/major_defects_created"
            ,"defects/critical_defects_created"
            ,"defects/total_defects"
        ],
        startDate: "2018-03-26",
        endDate: "2018-04-01"
    };

    render() {
        var elements = [];
        var keyNum = 0;
        this.state.routes.forEach(element => {
            elements.push(<KPI key={keyNum} route={element} startDate={this.state.startDate} endDate={this.state.endDate} />)
            keyNum++;
        });

        return (
            <div className="dashboard">
                <div className="dateSelectionButtons row justify-content-center">
                    <button type="button" className='btn btn-primary' onClick={() => this.changeDateRange("2018-03-26", "2018-04-01")}>7d</button>
                    <button type="button" className='btn btn-primary' onClick={() => this.changeDateRange("2018-03-01", "2018-04-01")}>30d</button>
                    <button type="button" className='btn btn-primary' onClick={() => this.changeDateRange("2017-11-01", "2018-04-01")}>6m</button>
                    <button type="button" className='btn btn-primary' onClick={() => this.changeDateRange("2017-04-01", "2018-04-01")}>1y</button>
                    <button type="button" className='btn btn-primary' onClick={() => this.changeDateRange("2018-01-01", "2018-04-01")}>ytd</button>
                    <button type="button" className='btn btn-primary' onClick={() => this.changeDateRange("2000-01-01", "2018-04-01")}>all</button>
                </div>
                <br />
                <div className="visualization row justify-content-center">
                    {elements}
                </div>
            </div>
        );
    }

    changeDateRange(start, end) {
        this.setState({startDate: start, endDate: end});
        console.log("startDate: %s, endDate: %s", this.state.startDate, this.state.endDate);
    }
}

export default BuildDashboard;