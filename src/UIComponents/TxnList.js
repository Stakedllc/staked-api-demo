import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

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
      case "STK", "PYBL", "PEND", "CLSED", "SCH": 
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
      case "PEND":
        return this.numberWithCommas((txn.reward / 1000000).toFixed(2));
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
      case "PYBL", "PEND", "CLSED":
          return "Reward";
      case "UNSTK":
          return "Unstake"
      default: 
        console.log("Should be a future payment");
        console.log(txn);
        return txn.kind;
    }
  }

  render() {
    const { classes } = this.props;

    const txns = this.props.txns || [];

    return (
      <List className={classes.list}>
        <ListItem color="inherit" className={txns.length != 0 ? classes.listItemSubheader : classes.listItemSubheaderNoBottomPadding}>
          <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">{`${txns.length || 0} Transactions`}</Typography>
        </ListItem>
      {txns.map((txn) => (
          <ListItem color="inherit">
            <Typography color="textPrimary">{this.getTransactionLabel(txn)}</Typography>
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