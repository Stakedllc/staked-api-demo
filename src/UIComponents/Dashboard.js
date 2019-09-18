import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from '@material-ui/core/LinearProgress';
import Navigation from "./Navigation.js";
import AddAccount from "./AddAccount.js";
import CurrencyList from "./CurrencyList.js";
import YieldTimeseriesChart from "./YieldTimeseriesChart";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import api from "../api.js";
import api_key from "../api_key.js";

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    margin: "auto",
    width: 700,
    borderRadius: 5,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)"
  },
  currencyListContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  currencyListItems: {
    width: 500,
    height: 450,
  },
  listDetail: {
    position: "absolute",
    right: "10px"
  },
  avatar: {
    position: "absolute",
    left: "0px",
  },
  subheader: {
    position: "relative"
  },
  listText: {
    position: "relative",
    marginLeft: "0px"
  },
  listLabel: {
    position: "relative",
    marginRight: "0px"
  },
  listItemSubheader: {
    paddingTop: "10px",
    paddingBottom: "10px"
  },
  button: {
    position: "absolute",
    right: "0px"
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
        'theme': 'rgba(70, 80, 159, 1)',
        'account': null,
        'yield_info': null
      },
      {
        'chain': 'Tezos',
        'symbol': 'XTZ',
        'theme': 'rgba(44, 125, 247, 1)',
        'account': null,
        'yield_info': null
      },
      {
        'chain': 'Dash',
        'symbol': 'DASH',
        'theme': 'rgba(39, 142, 224, 1)',
        'account': null,
        'yield_info': null
      },
      {
        'chain': 'Terra',
        'symbol': 'LUNA',
        'theme': 'rgba(40, 69, 174, 1)',
        'account': null
      },
      {
        'chain': 'Decred',
        'symbol': 'DCR',
        'theme': 'rgba(45, 216, 163, 1)',
        'yield_info': null
      },
      {
        'chain': 'Horizen',
        'symbol': 'ZEN',
        'theme': 'rgba(23, 162, 184, 1)',
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

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  
  getYields = async () => {
    var currencies = this.state.currencies;

    var yield_response = await api.get(`/yields?api_key=${api_key}&extended=true&by_key=false`);
    var yield_data = yield_response.data;
    yield_data.forEach((yield_info) => {
      currencies.map((currency) => {
        if(typeof currency.yield_info !== "undefined"){
          if(currency.chain == yield_info.currency){
            currency.yield_info = yield_info;
          }
        }
      })
    })
    
    await this.asyncForEach(currencies, async (currency) => {
      if(typeof currency.yield_info !== "undefined"){
        const timeseries_response = await api.get(`/yields/currency/${currency.chain}/timeseries?api_key=${api_key}&interval=1&num_entries=90`);
        currency.yield_info.timeseries = timeseries_response.data.timeseries;
      }
    })
    
    this.setState({
      loading: false,
      currencies: currencies
    });
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
          <List className={classes.list}>
            <ListItem color="inherit" className={classes.listItemSubheader}>
              <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">Historical Yields</Typography>
            </ListItem>
          </List>
          <YieldTimeseriesChart currencies={currencies}/>
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
