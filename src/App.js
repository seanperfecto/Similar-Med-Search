import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {drug: "", chosen: [], related: []};
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
    this.setState({related: []});
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
    this.setState({related: []});
    if (ele !== "Not Found") {
      fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${ele.rxcui}/related.json?tty=IN`)
        .then((resp) => resp.json())
        .then((data) => {
          let ingred = data.relatedGroup.conceptGroup[0].conceptProperties;
          let ingredList = [];
          ingred.forEach((ing) => {
            ingredList.push(ing.rxcui);
          });
          this.getRelatedDrugs(ingredList);
        });
    }
  }

  getRelatedDrugs(list){
    list.forEach((num) => {
      fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${num}/related.json?tty=SCD+SBD`)
        .then((resp) => resp.json())
        .then((data) => {
          this.setState({related: this.state.related.concat(data.relatedGroup.conceptGroup[0].conceptProperties)});
          this.setState({related: this.state.related.concat(data.relatedGroup.conceptGroup[1].conceptProperties)});
          console.log(this.state.related);
        });
    });
  }

  render() {
    let listItems, relatedItems;
    if (this.state.chosen) {
      listItems = this.state.chosen.map((ele,idx) =>
        <li key={idx} onClick={(e)=>this.searchRelated(e, ele)}>{ele.synonym ? ele.synonym: ele}</li>);
    }
    if (this.state.related) {
      relatedItems = this.state.related.map((ele,idx) =>
        <li key={idx}>{ele.name}</li>);
    }
    return (
      <div className="App">
        <div className="App-header">
          Similar Medicine Search<br/>
          <form onSubmit={this.handleSubmit}>
            <input type='text' onChange={this.updateSearch} value={this.state.drug} />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="App-intro">
          <div className='list-items'>
            SELECT MEDICINE:<br/>
            <ul>{listItems}</ul>
          </div>
          <div className='related-items'>
            RELATED MEDICINE:<br/>
            <ul>{relatedItems}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
