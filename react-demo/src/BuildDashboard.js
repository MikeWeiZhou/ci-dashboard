import React, { Component } from 'react';
import QA_Overall from './kpi/QA_Overall';

class BuildDashboard extends Component {
    // state = {
    //     startDate:
    //     endDate:
    // };

    render() {
        return (
            <div className="Build">
                <QA_Overall />
            </div>
        );
    }
}

export default BuildDashboard;