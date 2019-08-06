import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Navigation from "./Navigation.js";
import StakingYieldList from "./StakingYieldList.js";
import DetailedYieldInfo from "./DetailedYieldInfo.js";
import StakedFooter from "./StakedFooter.js"

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
    this.handleBackNav = this.handleBackNav.bind(this);
  }

  state = {
    currencySelectedTimeSeries: null,
  };

  handleCurrencySelected = (currency, event) => {
    const unfilteredCurrencyYieldList = this.props.currencyYieldList;
    var currencySelectedTimeSeries = unfilteredCurrencyYieldList.filter(function(currency_snapshot) {
      return currency_snapshot.currency == currency.currency;
    });
    currencySelectedTimeSeries.forEach(function (item, index) {
      item.date = new Date(item.timestamp)
    });
    this.setState({
        currencySelectedTimeSeries: currencySelectedTimeSeries
    });
  };

  handleBackNav = () => {
    this.setState({
        currencySelectedTimeSeries: null
    });
  };

  render() {
    const { classes } = this.props;

    const currencyYieldList = this.props.currencyYieldList;

    const currencySelectedTimeSeries = this.state.currencySelectedTimeSeries;

    const showStakingYieldList= (currencySelectedTimeSeries == null)

    var body = null;

    if(showStakingYieldList){
        body = <StakingYieldList currencyYieldList={currencyYieldList} handleCurrencySelected={this.handleCurrencySelected}/>
    }else{
        body = <DetailedYieldInfo currencySelectedTimeSeries={currencySelectedTimeSeries} />
    }

    return (
        <div className={classes.container}>
          <Navigation 
            isShowingYieldList={showStakingYieldList} 
            currencySelectedTimeSeries={currencySelectedTimeSeries} 
            handleBackNav={this.handleBackNav}
          />
          {body}
          <StakedFooter />
        </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
