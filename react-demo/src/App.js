import React, { Component } from 'react';
import './App.css';
import Category from './Category';

class App extends Component {
  responseData = {
    // QA category
    qa: {
      title: "Buid KPIs",
      kpis: [
        "build_success_overall",
        "build_success_per_platform",
        "build_success_per_product"        
      ]
    },
    // Defect category
    defect: {
      title: "Bug Tracking KPIs",
      kpis: [
        "bugs_created_per_day",
        "bugs_resolved_per_day"
      ]
    }
  };

  state = {responseData: this.responseData}

  render() {
    var categories = [];
    this.state.responseData.forEach(element => {

    })

    return (
      <div className="App"></div>
    );
  }
}

export default App;
