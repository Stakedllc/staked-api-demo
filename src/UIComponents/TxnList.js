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
    right: "20px"
  },
  listItemSubheaderNoBottomPadding: {
    paddingTop: "10px"
  },
  listItemSubheader: {
    paddingTop: "10px",
    paddingBottom: "20px"
  },
  avatar: {
    position: "absolute",
    left: "0px"
  },
});

class TxnList extends React.Component {

  state = {
    txns: null
  };

  componentDidMount() {
    var txns = this.props.txns;
    this.setState({
      txns: txns
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getTransactionColor(txn){
    switch(txn.kind){
      case "STK": 
        return "green";
      case "PYBL":
        return "green";
      case "PEND":
        return "Green";
      case "CLSD":
        return "green";
      case "CLSED":
        return "green";
      case "SCH":
        return "green";
      case "UNSTK":
          return "red"; 
      default: 
        console.log(txn);
        return "textPrimary";
    }
  }

  getTransactionAmount(txn) {
    switch(txn.kind){
      case "STK": 
        return this.numberWithCommas((txn.amount / 1000000).toFixed(2));
      case "UNSTK": 
        return this.numberWithCommas(((txn.amount / 1000000) * -1).toFixed(2));
      case "PYBL":
          return this.numberWithCommas((txn.reward / 1000000).toFixed(2));
      case "CLSD":
          return this.numberWithCommas((txn.reward / 1000000).toFixed(2));
      case "CLSED":
          return this.numberWithCommas((txn.total / 1000000).toFixed(2));
      case "PEND":
        if(txn.reward == null){
          return this.numberWithCommas((txn.total / 1000000).toFixed(2));
        }else{
          return this.numberWithCommas((txn.reward / 1000000).toFixed(2));
        }
      default: 
        console.log("Should be a future payment");
        console.log(txn);
        return this.numberWithCommas((txn.reward / 1000000).toFixed(2));
    }
  }

  getTransactionLabel(txn) {
    switch(txn.kind){
      case "STK": 
        return "Staked";
      case "SCH": 
        return "Scheduled Reward";
      case "PYBL":
        return "Reward";
      case "PEND":
        return "Pending Reward";
      case "CLSD":
        return "Reward";
      case "CLSED":
        return "Reward";
      case "UNSTK":
          return "Unstake"
      default: 
        console.log("Should be a future payment");
        console.log(txn);
        return txn.kind;
    }
  }

  getCurrencySymbolLabel(txn){
    switch(txn.chain){
      case "Cosmos": 
        return "ATOM";
      case "Dash":
        return "DASH";
      case "Terra":
        return "LUNA";
      case "Tezos":
        return "XTZ";
      default: 
        console.log("unexpected behavior");
        return "";
    }
  }

  render() {
    const { classes } = this.props;

    const txns = this.props.txns || [];

    return (
      <List className={classes.list}>
        {txns.slice(0, 1).map((txn) => (
          <ListItem color="inherit" className={txns.length != 0 ? classes.listItemSubheader : classes.listItemSubheaderNoBottomPadding}>
            <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">{`Recent Transactions`}</Typography>
          </ListItem>
      ))}
      {txns.slice(0, 10).map((txn) => (
          <ListItem color="inherit">
            <ListItemText
                  primary={
                    this.getCurrencySymbolLabel(txn)
                  }
                  secondary={`${this.getTransactionLabel(txn)}, ${txn.date.getMonth()+1}/${txn.date.getDate()}`}
            />
            <Typography color={this.getTransactionColor(txn)} className={classes.listDetail}>{this.getTransactionAmount(txn)}</Typography>
          </ListItem>
      ))}
      </List>
    );
  }
}

TxnList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TxnList);