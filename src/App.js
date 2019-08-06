import React from "react";
import APIKeyForm from "./APIKeyForm.js";
import YieldsList from "./YieldsList.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.confirmedAPIKey = this.confirmedAPIKey.bind(this);
    this.clearAPIKey = this.clearAPIKey.bind(this);
  }

  state = {
    api_key: null,
    currencyYieldList: null
  };

  confirmedAPIKey = (api_key, retrievedCurrencyYieldList) => {
    this.setState({
      api_key: api_key,
      currencyYieldList: retrievedCurrencyYieldList
    });
  };

  clearAPIKey = () => {
    this.setState({
      api_key: null,
      currencyYieldList: null
    });
  };

  render() {
    const apiKey = this.state.api_key;
    const currencyYieldList = this.state.currencyYieldList;
    if(apiKey == null || currencyYieldList == null){
      return <APIKeyForm confirmedAPIKey={this.confirmedAPIKey} />;
    }else {
      return <YieldsList currencyYieldList={currencyYieldList} clearAPIKey={this.clearAPIKey} />;
    }
  }
}

export default App;
