import React from "react";
import APIKeyForm from "./UIComponents/APIKeyForm.js";
import Dashboard from "./UIComponents/Dashboard.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.confirmedAPIKey = this.confirmedAPIKey.bind(this);
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

  render() {
    const apiKey = this.state.api_key;
    const currencyYieldList = this.state.currencyYieldList;
    if(apiKey == null || currencyYieldList == null){
      return <APIKeyForm confirmedAPIKey={this.confirmedAPIKey} />;
    }else {
      return <Dashboard currencyYieldList={currencyYieldList}/>;
    }
  }
}

export default App;
