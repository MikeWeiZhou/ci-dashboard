import React, { Component } from 'react';
import QaOverall from './kpi/QaOverall';

class BuildDashboard extends Component {
    // state = {
    //     startDate:
    //     endDate:
    // };

    render() {
        return (
            <div className="Build">
                <QaOverall />
            </div>
        );
    }
}

export default BuildDashboard;