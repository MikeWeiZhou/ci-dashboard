import React, { Component } from 'react';
import 'jquery';
import Category from './Category';

class App extends Component {
  constructor(props) {
    super(props);
    // Initial state of the component
    this.state = {
      categories: [],
      startDate: "2017-05-01",
      endDate: "2018-05-01"
    };

    // Bind functions to class
    this.setTabText = this.setTabText.bind(this);

    this.refList = {};
  }

  // Called after component is mounted
  componentDidMount() {
    this.requestKPICategories();
  }

  componentDidUpdate() {
    console.log(this.refList);
  }
  
  render() {
    var categoryList = [];
    var categoryPanes = [];
    var keyNum = 0;
    this.state.categories.forEach(category => {
      if (keyNum === 0) {
        categoryList.push(
          <li key={`li${keyNum}`} className="nav-item">
            <a className="nav-link active" id={`${category}Tab`} ref={this.refList[category]} data-toggle="pill" href={`#${category}Pane`} role="tab">{category}</a>
          </li>
        );
        categoryPanes.push(<Category key={`cat${keyNum}`} category={category} active={true} setTabText={this.setTabText} startDate={this.state.startDate} endDate={this.state.endDate} />);
      } else {
        categoryList.push(
          <li key={`li${keyNum}`} className="nav-item">
            <a className="nav-link" id={`${category}Tab`} ref={this.refList[category]} data-toggle="pill" href={`#${category}Pane`} role="tab">{category}</a>
          </li>
        );
        categoryPanes.push(<Category key={`cat${keyNum}`} category={category} active={false} setTabText={this.setTabText} startDate={this.state.startDate} endDate={this.state.endDate} />);      
      }
      keyNum++;
    });

    return (
      <div id="app">
        <ul className="nav nav-pills row d-flex justify-content-center" id="tablist" role="tablist">
          {categoryList}
        </ul>
        <br />
        <div className="dateSelectionButtons row d-flex   justify-content-center">
            <button type="button" className='btn btn-primary' onClick={() => this.setDateRange("2018-03-26", "2018-04-01")}>7d</button>
            <button type="button" className='btn btn-primary' onClick={() => this.setDateRange("2018-03-01", "2018-04-01")}>30d</button>
            <button type="button" className='btn btn-primary' onClick={() => this.setDateRange("2017-11-01", "2018-04-01")}>6m</button>
            <button type="button" className='btn btn-primary' onClick={() => this.setDateRange("2017-04-01", "2018-04-01")}>1y</button>
            <button type="button" className='btn btn-primary' onClick={() => this.setDateRange("2018-01-01", "2018-04-01")}>ytd</button>
            <button type="button" className='btn btn-primary' onClick={() => this.setDateRange("2000-01-01", "2018-04-01")}>all</button>
        </div>
        <br />
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
        this.setState({ 
          categories: resJSON
        });
        this.state.categories.forEach(category => {        
          this.refList[category] = React.createRef();
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

  setDateRange(start, end) {
    this.setState({startDate: start, endDate: end});
    console.log("startDate: %s, endDate: %s", this.state.startDate, this.state.endDate);
  }

  setTabText(refId, newText) {
    this.refList[refId].current.innerHTML = newText;
  }
}

export default App;