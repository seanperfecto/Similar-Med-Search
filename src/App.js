import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {drug: "", chosen: [], related: ""};
    this.updateSearch = this.updateSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchRelated = this.searchRelated.bind(this);
    this.getRelatedDrugs = this.getRelatedDrugs.bind(this);
  }

  updateSearch(e){
    this.setState({drug: `${e.target.value}`});
  }

  handleSubmit(e){
    e.preventDefault();
    fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${this.state.drug}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.drugGroup.conceptGroup) {
          let group = data.drugGroup.conceptGroup.filter(x => { return x.tty === 'SBD'; });
          this.setState({chosen: group[0].conceptProperties});
        } else {
          this.setState({chosen: ['Not Found']});
        }

      });
  }

  searchRelated(e, ele){
    if (ele !== "Not Found") {
      fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${ele.rxcui}/related.json?tty=IN`)
        .then((resp) => resp.json())
        .then((data) => {
          let ingred = data.relatedGroup.conceptGroup[0].conceptProperties;
          let ingredList = [];
          ingred.forEach((ing) => {
            ingredList.push(ing.rxcui);
          });
          this.getRealatedDrugs(ingredList);
        });
    }
  }

  getRealatedDrugs(list){
    list.forEach((num) => {

    });
  }

  render() {
    let listItems;
    if (this.state.chosen) {
      listItems = this.state.chosen.map((ele,idx) =>
        <li key={idx} onClick={(e)=>this.searchRelated(e, ele)}>{ele.synonym ? ele.synonym: ele}</li>);
    }
    return (
      <div className="App">
        <div className="App-header">
          <form onSubmit={this.handleSubmit}>
            <input type='text' onChange={this.updateSearch} value={this.state.drug} />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="App-intro">
          <ul>{listItems}</ul>
        </div>
      </div>
    );
  }
}

export default App;
