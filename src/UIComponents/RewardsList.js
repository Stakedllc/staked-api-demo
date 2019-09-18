import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';

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
    marginRight: "0px",
    color: "green"
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

class RewardsList extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    currenciesAdded: null
  };

  componentDidMount() {
    const currencies = this.props.currencies;
    const reportingCurrencies = currencies.filter((currency) => (typeof currency.account !== "undefined"))
    const currenciesAdded = reportingCurrencies.filter((currency) => currency.account != null) || []
    
    this.setState({
      currenciesAdded: currenciesAdded
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
            txns.forEach((txn) => {
                if(txn.kind == "STK"){
                    beginBalance = beginBalance + (txn.amount/1000000);
                }
            })
          }
        }
        return beginBalance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      case "Tezos":
          var beginBalance = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              txns.forEach((txn) => {
                if(txn.kind == "STK"){
                    beginBalance = beginBalance + (txn.amount/1000000);
                }
              })
            }
          }
          return beginBalance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      case "Dash":
        var beginBalance = 0;
        if(currency.account != null){
            if(currency.account.txns != null){
            const txns = currency.account.txns;
            txns.forEach((txn) => {
                if(txn.kind == "STK"){
                    beginBalance = beginBalance + (txn.amount/1000000);
                }
            })
            }
        }
        return beginBalance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      case "Terra":
          var beginBalance = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              txns.forEach((txn) => {
                if(txn.kind == "STK"){
                    beginBalance = beginBalance + (txn.amount/1000000);
                }
              })
            }
          }
          return beginBalance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      default:
        return 0;
    }
  }

  getTotalRewards(currency) {
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
          return totalRewards.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      case "Tezos":
          var totalRewards = 0;
          var staked = 0;
          if(currency.account != null){
            if(currency.account.txns != null){
              const txns = currency.account.txns;
              txns.forEach((txn) => {
                if(txn.kind == "PYBL"){
                    totalRewards = totalRewards + (txn.reward/1000000);
                }else if(txn.kind == "STK"){
                    staked = staked + (txn.reward/1000000);
                }
              })
            }
          }
          return totalRewards.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          return totalRewards.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          return totalRewards.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;

    const currenciesAdded = this.state.currenciesAdded || [];

    var subheader = null;

    console.log(currenciesAdded);

    if(currenciesAdded.length > 0){
        subheader = 
        <ListItem color="inherit" className={classes.listItemSubheader}>
          <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">Rewards</Typography>
        </ListItem>;
    }

    return (
      <List className={classes.list}>
        {subheader}
        {currenciesAdded.map((currency) => (
            <React.Fragment>
            <ListItem color="inherit">
                <ListItemText
                primary={
                    <React.Fragment className={classes.listText}>
                    <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                    </React.Fragment>
                }
                secondary={`Staked ` + this.getBeginningBalance(currency)}
                />
                <div className={classes.listDetail}>
                <ListItemText
                    primary={
                    <React.Fragment>
                        <Typography variant="h6" align={'right'} className={classes.listLabel}>{this.getTotalRewards(currency)}</Typography>
                    </React.Fragment>
                    }
                    secondary={`${currency.symbol} Earned`}
                />
                </div>
            </ListItem>
            </React.Fragment>
        ))}
      </List>
    );
  }
}

RewardsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RewardsList);