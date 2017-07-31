import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {drug: "", chosen: [], related: [], searched: ""};
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
    this.setState({related: [], searched: ""});
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
    this.setState({related: [], searched: ele.synonym});
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
        <div>
        <div className="App-header">
          <form onSubmit={this.handleSubmit}>
            <span id="title">Search similar medicine for</span><input type='text' onChange={this.updateSearch} value={this.state.drug} />
            <span id="title">.</span>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="App-intro">
          <div className='list-items'>
            Please select:<br/>
          <hr/>
            <ul>{listItems}</ul>
          </div>
          <div className='related-items'>
            Related medicine for <span id='related'>{this.state.searched}</span>:<br/>
          <hr/>
            <ul>{relatedItems}</ul>
          </div>
        </div>
        </div>
        <footer>By Sean Perfecto</footer>
      </div>
    );
  }
}

export default App;
