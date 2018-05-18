import React, { Component } from 'react';
import KPI from './KPI';

class Category extends Component {
  state = {
    title: "",
    kpis: [],
    startDate: "",
    endDate: ""
  }

  // Called after component is mounted
  componentDidMount() {
    this.requestKPICategoryDetails();
  }

  // Called after component is updated    
  componentDidUpdate(prevProps) {
    // Only request data if props is updated
    if (prevProps.startDate  !== this.props.startDate) {
      this.requestKPICategoryDetails();
      this.props.setTabText(this.props.category, this.state.title);
    }
  }

  render() {
    var kpis = [];
    var keyNum = 0;
    this.state.kpis.forEach(kpi => {
      kpis.push(<KPI key={`${this.props.category}${keyNum}`} category={this.props.category} kpi={kpi} startDate={this.state.startDate} endDate={this.state.endDate} />)
      keyNum++;
    });

    return(
      <div className={(this.props.active) ? `tab-pane fade active show` : `tab-pane fade`} id={`${this.props.category}Pane`}  role="tabpanel">
          <div className="visualizations row justify-content-center">
              {kpis}
          </div>
      </div>
    );
  }

  async requestKPICategoryDetails() {
      // Construct route
      var url = `getkpicategorydetails/${this.props.category}`;
      
      try{
        // GET request to retrieve data
        var res = await fetch(url);
        var resJSON = {};
  
        // Set state if response is OK
        if (res.ok) {
          resJSON = await res.json();
          this.setState({
            title: resJSON.title,
            kpis: resJSON.kpis,
            startDate: this.props.startDate,
            endDate: this.props.endDate
          });
        } else {
            resJSON = await res.json();
            console.log(`Failed request - url: ${res.url}, status: ${res.status}`);
            console.log(resJSON);
        }
      } catch (error) {
        console.log(error.message);      
      }
    }
}

export default Category;