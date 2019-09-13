import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Navigation from "./Navigation.js";
import CurrencyList from "./CurrencyList.js";
import DetailedInfo from "./DetailedInfo.js";
import StakedFooter from "./StakedFooter.js";
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
    addingAccountAddress: null
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

    var body = null;

    if(!currencyIsSelected){
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
