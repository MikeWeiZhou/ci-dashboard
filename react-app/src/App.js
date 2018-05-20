import React, { Component } from "react";
import Category from "./Category";

class App extends Component {
  constructor(props) {
    super(props);
    // Initial state of the component
    this.state = {
      categories: {},
      startDate: "",
      endDate: "",
      movAvgPeriod: null
    };

    // Bind functions to class
    this.setTabText = this.setTabText.bind(this);

    this.tempEndDate = new Date(2018, 3, 1);
    // console.log(`temp end date: ${this.tempEndDate}`);
  }

  // Called after component is mounted
  componentDidMount() {
    this.setDateRange_7d();
    this.requestKPICategories();    
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("App.js - startDate: %s, endDate: %s", this.state.startDate, this.state.endDate);
    // console.log(this.state.categories);
    // console.log(prevState);
    if (prevState.movAvgPeriod == null || this.state.movAvgPeriod == null)
      this.requestMovingAveragePeriod();    
  }
  
  render() {
    // console.log(`App render is running`);
    var categoryList = [];
    var categoryPanes = [];
    var keyNum = 0;

    for (var catKey in this.state.categories) {
      if (this.state.categories.hasOwnProperty(catKey)){
        if (keyNum === 0) {
          categoryList.push(
            <li key={`li${keyNum}`} className="nav-item">
              <a className="nav-link active" id={`${catKey}Tab`} data-toggle="pill" href={`#${catKey}Pane`}>{this.state.categories[catKey]}</a>
            </li>
          );
          categoryPanes.push(<Category key={`cat${keyNum}`} active={true} category={catKey} tabText={this.state.categories[catKey]} setTabText={this.setTabText} startDate={this.state.startDate} endDate={this.state.endDate} />);
        } else {
          categoryList.push(
            <li key={`li${keyNum}`} className="nav-item">
              <a className="nav-link" id={`${catKey}Tab`} data-toggle="pill" href={`#${catKey}Pane`}>{this.state.categories[catKey]}</a>
            </li>
          );
          categoryPanes.push(<Category key={`cat${keyNum}`} active={false} category={catKey} tabText={this.state.categories[catKey]} setTabText={this.setTabText} startDate={this.state.startDate} endDate={this.state.endDate} />);      
        }
      }
      keyNum++;
    };

    return (
      <div id="app">
        <ul className="nav nav-pills row d-flex justify-content-center" id="tablist">
          {categoryList}
        </ul>
        <div className="btn-group btn-group-toggle row d-flex justify-content-center" id="dateSelectionButtons" data-toggle="buttons">
          <label className="btn btn-outline-primary active" onClick={() => this.setDateRange_7d()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option1" defaultChecked={true} />7d
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_14d()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option1" />14d
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_1m()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option2" />1m
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_3m()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option2" />3m
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_6m()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option3" />6m
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_1y()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option4" />1y
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_ytd()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option5" />ytd
          </label>
          <label className="btn btn-outline-primary" onClick={() => this.setDateRange_all()}>
            <input type="radio" className="btn btn-outline-primary" name="dateRange" id="option5" />all
          </label>
          <div className="justify-content-end">Moving average period: {this.state.movAvgPeriod}</div> 
        </div>
        <div className="tab-content">
          {categoryPanes}
        </div>
      </div>
    );
  }

  async requestKPICategories() {
    // Construct route
    var url = `getkpicategories`;
    
    try{
      // GET request to retrieve data
      var res = await fetch(url);
      var resJSON = {};

      // Set state if response is OK
      if (res.ok) {
        resJSON = await res.json();
        var newCategories = {};
        for (var value of resJSON) {          
          newCategories[value] = null;
        }
        this.setState({
          categories: newCategories
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

  async requestMovingAveragePeriod() {
    var url = `getkpimovingaverageperiod/${this.state.startDate}/${this.state.endDate}`;

    try{
      // GET request to retrieve data
      var res = await fetch(url);
      var resJSON = {};

      if (res.ok) {
        // GET request to retrieve data
        resJSON = await res.json();
        this.setState({
          movAvgPeriod: resJSON
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

  setTabText(catKey, newText) {
    this.setState((prevState) => {
      prevState.categories[catKey] = newText;
    });
  }

  setDateRange(start, end) {
    this.setState({startDate: start, endDate: end});
  }

  setDateRange_7d() {
    // var end = new Date();
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());
    
    start.setDate(start.getDate() - 6);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_14d() {
    // var end = new Date(); 
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());
    
    start.setDate(start.getDate() - 13);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_1m() {
    // var end = new Date(); 
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setMonth(start.getMonth() - 1);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
    this.requestMovingAveragePeriod();
  }

  setDateRange_3m() {
    // var end = new Date();   
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setMonth(start.getMonth() - 3);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_6m() {
    // var end = new Date();  
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setMonth(start.getMonth() - 6);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_1y() {
    // var end = new Date();   
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setFullYear(start.getFullYear() - 1);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_ytd() {
    // var end = new Date();
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setMonth(0);
    start.setDate(1);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_all() {
    // var end = new Date();
    var end = this.tempEndDate;    
    var start = "2017-01-01";
    this.setState({startDate: start, endDate: end.toDateString(), movAvgPeriod: null});
  }
}

export default App;