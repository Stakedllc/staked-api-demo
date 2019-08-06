import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const styles = theme => ({
  greenYieldLabel: {
    position: "absolute",
    right: "20px",
    color: "green"
  },
  redYieldLabel: {
    position: "absolute",
    right: "20px",
    color: "red"
  }
});

class StakingYieldList extends React.Component {

  state = {
    displayCurrencyYieldList: []
  };

  componentDidMount() {
    const retrievedCurrencyYieldList = this.props.currencyYieldList;
    var displayCurrencyYieldList = [];
    var latestDate = new Date(retrievedCurrencyYieldList[0].timestamp);
    retrievedCurrencyYieldList.forEach(function (currencyData, index) {
        var currencyDataDate = new Date(currencyData.timestamp);
        if(currencyDataDate.getDate() == latestDate.getDate()) {
            displayCurrencyYieldList.push(currencyData);
        }
      });
    displayCurrencyYieldList.sort(function(a, b) {
        return b.yield - a.yield;
    });
    this.setState({
        displayCurrencyYieldList: displayCurrencyYieldList
    });
  }

  setUpDataForDisplay = () => {
    const retrievedCurrencyYieldList = this.props.currencyYieldList;
    var displayCurrencyYieldList = [];
    var latestDate = new Date(retrievedCurrencyYieldList[0].timestamp);
    retrievedCurrencyYieldList.forEach(function (currencyData, index) {
        var currencyDataDate = new Date(currencyData.timestamp);
        if(currencyDataDate.getDate() == latestDate.getDate()) {
            displayCurrencyYieldList.push(currencyData);
        }
      });
    displayCurrencyYieldList.sort(function(a, b) {
        return b.yield - a.yield;
    });
    this.setState({
        displayCurrencyYieldList: displayCurrencyYieldList
    });
  }

  render() {
    const { classes } = this.props;

    const displayCurrencyYields = this.state.displayCurrencyYieldList;

    return (
      <List className={classes.list}>
        {displayCurrencyYields.map((data) => (
          <ListItem color="inherit" button onClick={(event) => this.props.handleCurrencySelected(data, event)}>
            <Typography variant="h6" color="textPrimary">{data.currency}</Typography>
            <Typography className={classes.greenYieldLabel} variant="h6">{(data.yield * 100).toFixed(2) + "%"}</Typography>
          </ListItem>
        ))}
      </List>
    );
  }
}

StakingYieldList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StakingYieldList);
