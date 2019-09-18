import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

const styles = theme => ({
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

class CurrencyList extends React.Component {

  constructor(props) {
    super(props);
    this.numberWithCommas = this.numberWithCommas.bind(this);
  }

  state = {
    currenciesAdded: null,
    currenciesNotAdded: null,
    notReportingCurrencies: null
  };

  componentDidMount() {
    const currencies = this.props.currencies;
    var reportingCurrencies = currencies.filter((currency) => (typeof currency.account !== "undefined"))
    var notReportingCurrencies = currencies.filter((currency) => (typeof currency.account === "undefined"))
    var currenciesAdded = reportingCurrencies.filter((currency) => currency.account != null) || []
    var currenciesNotAdded = reportingCurrencies.filter((currency) => currency.account == null) || []
    
    this.setState({
      currenciesAdded: currenciesAdded,
      currenciesNotAdded: currenciesNotAdded,
      notReportingCurrencies: notReportingCurrencies
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getBeginningBalance(currency){
    switch(currency.chain){
      case "Cosmos":
        var beginBalance = 0;
        if(currency.account != null){
          if(currency.account.txns != null){
            const txns = currency.account.txns;
            for(var txn in txns){
              if(txn.kind == "STK"){
                beginBalance = beginBalance + (txn.amount/1000000);
              }
            }
          }
        }
        return beginBalance;
      case "Tezos":
          var beginBalance = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              for(var txn in txns){
                if(txn.kind == "STK"){
                  beginBalance = beginBalance + (txn.amount/1000000);
                }
              }
            }
          }
          return beginBalance;
      case "Dash":
        return 1000;
      case "Terra":
          var beginBalance = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              for(var txn in txns){
                if(txn.kind == "STK"){
                  beginBalance = beginBalance + (txn.amount/1000000);
                }
              }
            }
          }
          return beginBalance;
      default:
        return 0;
    }
  }

  getTotalRewards(currency){
    switch(currency.chain){
      case "Cosmos":
          var totalRewards = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              for(var txn in txns){
                if(txn.kind == "CLSED"){
                  totalRewards = totalRewards + (txn.reward/1000000);
                }
              }
            }
          }
          return totalRewards;
      case "Tezos":
          var totalRewards = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              for(var txn in txns){
                if(txn.kind == "PYBL"){
                  totalRewards = totalRewards + (txn.reward/1000000);
                }
              }
            }
          }
          return totalRewards;
      case "Dash":
          var totalRewards = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              for(var txn in txns){
                if(txn.kind == "PAID"){
                  totalRewards = totalRewards + (txn.reward/1000000);
                }
              }
            }
          }
          return totalRewards;
      case "Terra":
          var totalRewards = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              for(var txn in txns){
                if(txn.kind == "CLSED"){
                  totalRewards = totalRewards + (txn.total/1000000);
                }
              }
            }
          }
      default:
        break;
    }
  }

  getYieldString(currency) {
    if(typeof currency.yield_info === "undefined"){
      return `Unavailable`;
    }else{
      return `${(currency.yield_info.yield * 100).toFixed(2)}%`;
    }
  }

  render() {
    const { classes } = this.props;

    const currenciesAdded = this.state.currenciesAdded || [];
    const currenciesNotAdded = this.state.currenciesNotAdded || [];
    const notReportingCurrencies = this.state.notReportingCurrencies || [];

    return (
      <List className={classes.list}>
        <ListItem color="inherit" className={classes.listItemSubheader}>
          <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">Opportunities</Typography>
        </ListItem>
        {currenciesAdded.map((currency) => (
            <React.Fragment>
              <ListItem color="inherit" button onClick={(event) => console.log(event)}>
                <ListItemText
                  primary={
                    <React.Fragment className={classes.listText}>
                      <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                    </React.Fragment>
                  }
                  secondary={`${currency.symbol}, Earning ` + this.getYieldString(currency)}
                />
                <div className={classes.listDetail}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography variant="h6" align={'right'} className={classes.listLabel}>{this.numberWithCommas(currency.account.balance)}</Typography>
                      </React.Fragment>
                    }
                    secondary={"Account Balance"}
                  />
                </div>
              </ListItem>
            </React.Fragment>
          ))}
        {currenciesNotAdded.map((currency) => (
          <React.Fragment>
            <ListItem color="inherit" button onClick={(event) => console.log(event)}>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                  </React.Fragment>
                }
                secondary={`${currency.symbol}, Yield ` + this.getYieldString(currency)}
              />
              <Button color="primary" className={classes.button} onClick={(event) => this.props.addAccountOpen(currency, event)}>
                Add Account
              </Button>
            </ListItem>
          </React.Fragment>
        ))}
        {notReportingCurrencies.map((currency) => (
            <React.Fragment>
              <ListItem color="inherit" button onClick={(event) => console.log(event)}>
                <ListItemText
                  primary={
                    <React.Fragment className={classes.listText}>
                      <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                    </React.Fragment>
                  }
                  secondary={`${currency.symbol}, Yield ` + this.getYieldString(currency)}
                />
                <Button color="primary" disabled className={classes.button}>
                  Unavailable
                </Button>
              </ListItem>
            </React.Fragment>
          ))}
      </List>
    );
  }
}

CurrencyList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CurrencyList);
