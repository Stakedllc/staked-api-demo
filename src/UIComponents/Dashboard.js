import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Navigation from "./Navigation.js";
import CurrencyList from "./CurrencyList.js";
import DetailedInfo from "./DetailedInfo.js";
import StakedFooter from "./StakedFooter.js";
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import api from "../api.js";
import api_key from "../api_key.js";

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 400,
    marginTop: theme.spacing.unit * 20,
    padding: theme.spacing.unit * 3,
    margin: "auto",
    borderRadius: 5,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)"
  }
});

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.handleCurrencySelected = this.handleCurrencySelected.bind(this);
    this.handleCurrencyAddAccountDialogueOpen = this.handleCurrencyAddAccountDialogueOpen.bind(this);
    this.handleCurrencyAddAccountDialogueClose = this.handleCurrencyAddAccountDialogueClose.bind(this);
    this.handleCurrencyAddAccountGetReporting = this.handleCurrencyAddAccountGetReporting.bind(this);
    this.handleBackNav = this.handleBackNav.bind(this);
  }

  state = {
    currencies: [
      {
        'chain': 'Cosmos',
        'symbol': 'ATOM',
        'account': null
      },
      {
        'chain': 'Tezos',
        'symbol': 'XTZ',
        'account': null
      },
      {
        'chain': 'Dash',
        'symbol': 'DASH',
        'account': null
      },
      {
        'chain': 'Terra',
        'symbol': 'LUNA',
        'account': null
      }
    ],
    currencySelected: null,
    addingAccountOpen: false,
    addingAccountChain: null,
    addingAccountAddress: null,
    addingAccountLoading: false
  };

  handleCurrencyAddAccountDialogueOpen = (currency, event) => {
    this.setState({
      addingAccountOpen: true,
      addingAccountChain: currency.chain
    });
  };

  handleCurrencyAddAccountDialogueClose = () => {
    this.setState({
      addingAccountOpen: false,
      addingAccountChain: null,
      addingAccountAddress: null,
    });
  };

  handleCurrencyAddAccountGetReporting = () => {
    console.log(this.state.addingAccountAddress);
    const addingAccountChain = this.state.addingAccountChain;
    const addingAccountAddress = this.state.addingAccountAddress;
    var currencies = this.state.currencies;
    this.setState({
      addingAccountOpen: false,
      addingAccountLoading: true
    });
    api.get(`/reports/${addingAccountChain}/delegator/${addingAccountAddress}/balance?api_key=${api_key}`)
    .then(res => {
      console.log(res);
      currencies.map(function(currency){
        if(currency.chain == addingAccountChain){
          currency.account = {
            'address': addingAccountAddress,
            'balance': (res.data.balance/1000000).toFixed(2)
          }
        }
      })
      console.log(currencies);
      this.setState({
        currencies: currencies,
        addingAccountLoading: false
      });
    })
    .catch(error => {
      console.log(error);
    });
  };

  handleCurrencySelected = (currency, event) => {
    this.setState({
      currencySelected: currency,
    });
  };

  handleBackNav = () => {
    this.setState({
      currencySelected: null
    });
  };

  render() {
    const { classes } = this.props;

    const currencies = this.state.currencies;
    const currencySelected = this.state.currencySelected;
    const currencyIsSelected = (currencySelected != null);
    const addingAccountOpen = this.state.addingAccountOpen;
    const addingAccountChain = this.state.addingAccountChain;
    const addingAccountLoading = this.state.addingAccountLoading;

    var body = null;

    if(addingAccountLoading){
      body = <LinearProgress/>;
    }else if(!currencyIsSelected){
      body = <CurrencyList currencies={currencies} handleCurrencyAddAccountDialogueOpen={this.handleCurrencyAddAccountDialogueOpen} handleCurrencySelected={this.handleCurrencySelected}/>;
    }else{
      body = <DetailedInfo currencySelected={currencySelected} />;
    }

    return (
        <div className={classes.container}>
          <Navigation 
            isShowingYieldList={!currencyIsSelected} 
            currencySelected={currencySelected} 
            handleBackNav={this.handleBackNav}
          />
          {body}
          <Dialog open={(addingAccountOpen)} onClose={this.handleCurrencyAddAccountDialogueClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add {addingAccountChain} Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To get reporting on your delegation to Staked, please input your {addingAccountChain} address
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Your address"
                onChange={(event) => this.setState({addingAccountAddress: event.target.value})}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCurrencyAddAccountDialogueClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleCurrencyAddAccountGetReporting} color="primary">
                Add Account
              </Button>
            </DialogActions>
          </Dialog>
          <StakedFooter />
        </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
