import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Cosmos from './images/Cosmos.png';
import Tezos from './images/Tezos.png';
import Dash from './images/Dash.png';

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
    paddingBottom: "20px"
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
    this.getImageFromChain = this.getImageFromChain.bind(this);
  }

  state = {
    currenciesAdded: null,
    currenciesNotAdded: null
  };

  componentDidMount() {
    const currencies = this.props.currencies;
    const currenciesAdded = currencies.filter((currency) => currency.account != null)
    const currenciesNotAdded = currencies.filter((currency) => currency.account == null)
    this.setState({
      currenciesAdded: currenciesAdded,
      currenciesNotAdded: currenciesNotAdded
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getImageFromChain(chainName){
    switch(chainName){
      case "Cosmos":
        return Cosmos;
      case "Tezos":
        return Tezos;
      case "Dash":
        return Dash;
      default:
        break;
    }
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
        break;
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

  render() {
    const { classes } = this.props;

    const currenciesAdded = this.state.currenciesAdded || [];
    const currenciesNotAdded = this.state.currenciesNotAdded || [];

    return (
      <List className={classes.list}>
        <ListItem color="inherit" className={classes.listItemSubheader}>
          <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">Chains</Typography>
        </ListItem>
        {currenciesAdded.map((currency) => (
            <React.Fragment>
              <Tooltip title="Click for Detailed View" enterDelay={500} leaveDelay={200}>
                <ListItem color="inherit" button onClick={(event) => console.log(event)}>
                  <ListItemText
                    primary={
                      <React.Fragment className={classes.listText}>
                        <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                      </React.Fragment>
                    }
                    secondary={`${currency.symbol}, Earning ${(currency.yield_info.yield * 100).toFixed(2)}%`}
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
              </Tooltip>
            </React.Fragment>
          ))}
        {currenciesNotAdded.map((currency) => (
          <React.Fragment>
            <Tooltip title="Click for Detailed View" enterDelay={500} leaveDelay={200}>
              <ListItem color="inherit">
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                    </React.Fragment>
                  }
                  secondary={`${currency.symbol}, Yield ${(currency.yield_info.yield * 100).toFixed(2)}%`}
                />
                <Button color="primary" className={classes.button} onClick={(event) => this.props.addAccountOpen(currency, event)}>
                  Add Account
                </Button>
              </ListItem>
            </Tooltip>
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
