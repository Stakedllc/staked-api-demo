import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';
import Navigation from "./Navigation.js";
import AddAccount from "./AddAccount.js";
import CurrencyList from "./CurrencyList.js";
import TxnList from "./TxnList.js";
import api from "../api.js";
import api_key from "../api_key.js";

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 400,
    marginTop: theme.spacing.unit * 15,
    padding: theme.spacing.unit * 3,
    margin: "auto",
    borderRadius: 5,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)"
  }
});

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.addAccountOpen = this.addAccountOpen.bind(this);
    this.addAccountClose = this.addAccountClose.bind(this);
    this.getReporting = this.getReporting.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.getTxns = this.getTxns.bind(this);
  }

  state = {
    currencies: [
      {
        'chain': 'Cosmos',
        'symbol': 'ATOM',
        'account': null,
        'yield_info': null
      },
      {
        'chain': 'Tezos',
        'symbol': 'XTZ',
        'account': null,
        'yield_info': null
      },
      {
        'chain': 'Dash',
        'symbol': 'DASH',
        'account': null,
        'yield_info': null
      }
    ],
    addAccountOpen: false,
    addAccountChain: null,
    loading: false
  };

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.getYields();
  }

  addAccountOpen = (currency, event) => {
    this.setState({
      addAccountOpen: true,
      addAccountChain: currency.chain
    });
  };

  addAccountClose = () => {
    this.setState({
      addAccountOpen: false,
      addAccountChain: null
    });
  };

  getYields = () => {
    var currencies = this.state.currencies;
    api.get(`/yields?api_key=${api_key}&extended=true&by_key=false`).then(res => {
      console.log(res.data);
      res.data.forEach((yield_info) => {
        currencies.map((supported) => {
          if(supported.chain == yield_info.currency){
            supported.yield_info = yield_info;
            console.log('here');
          }
          console.log(supported.chain);
          console.log(yield_info);
        })
      })
      console.log(currencies);
      this.setState({
        loading: false,
        currencies: currencies
      });
    })
  }

  getReporting = (chain, address) => {
    this.addAccountClose();
    this.setState({
      loading: true
    })
    this.getBalance(chain, address, (balance) => {
      this.getTxns(chain, address, (txns) => {
        var currencies = this.state.currencies;
        currencies.map(function(currency){
          if(currency.chain == chain){
            currency.account = {
              'address': address,
              'balance': balance,
              'txns': txns
            }
          }
        })
        this.setState({
          currencies: currencies,
          loading: false
        })
      })
    })
  };

  getBalance(chain, address, callback){
    api.get(`/reports/${chain}/delegator/${address}/balance?api_key=${api_key}`)
    .then(res => {
      console.log(res);
      const balance = (res.data.balance/1000000).toFixed(2)
      callback(balance);
    }).catch(error => {
      console.log(error);
    });
  }

  getTxns(chain, address, callback){
    api.get(`/reports/${chain}/delegator/${address}/txns?api_key=${api_key}`)
      .then(res => {
        console.log(res);
        var txns = res.data;
        txns.forEach(txn => txn.date = new Date(txn.transaction_time));
        txns.forEach(txn => txn.chain = chain);
        txns.sort(function(a, b) {
          return b.date.valueOf() - a.date.valueOf();
        });
        callback(txns);
      })
  }

  combineTxns() {
    const currencies = this.state.currencies;
    const currenciesWithAccounts = currencies.filter(currency => currency.account != null) || [];
    const currenciesWithTxns = currenciesWithAccounts.filter(currency => currency.account.txns != null) || [];
    const txns = currenciesWithTxns.map((currency) => currency.account.txns);
    var fullTxnList = [].concat.apply([], txns);
    fullTxnList.sort(function(a, b) {
      return b.date.valueOf() - a.date.valueOf();
    });
    return fullTxnList;
  }

  render() {
    const { classes } = this.props;

    const currencies = this.state.currencies;
    const txns = this.combineTxns();
    const loading = this.state.loading;
    const addAccountOpen = this.state.addAccountOpen;
    const addAccountChain = this.state.addAccountChain;

    var body = null;

    if(loading){
      body = <LinearProgress className={classes.loader}/>;
    }else{
      body = (
        <React.Fragment>
          <CurrencyList currencies={currencies} addAccountOpen={this.addAccountOpen}/>
        </React.Fragment>
      );
    }

    return (
        <div className={classes.container}>
          <Navigation />
          <AddAccount open={addAccountOpen} close={this.addAccountClose} chain={addAccountChain} getReporting={this.getReporting}/>
          {body}
        </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
