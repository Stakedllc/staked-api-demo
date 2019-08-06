import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CodeIcon from "@material-ui/icons/Code";
import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import {Line} from 'react-chartjs-2';

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
  },
  greenYieldLabel: {
    position: "absolute",
    right: "20px",
    color: "green"
  },
  redYieldLabel: {
    position: "absolute",
    right: "20px",
    color: "red"
  },
  appBar: {
        top: "auto",
        bottom: 0
  },
  backNavLink: {
    cursor: "pointer"
  },
  breadcrumb: {
    marginBottom: 10
  }
});

class YieldsList extends React.Component {

  state = {
    unfilteredCurrencyYieldList: [],
    displayCurrencyYieldList: [],
    selectedCurrencyTimeSeries: null
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
        unfilteredCurrencyYieldList: retrievedCurrencyYieldList,
        displayCurrencyYieldList: displayCurrencyYieldList
    });
  }

  handleCurrencyClicked = (currency, event) => {
    const unfilteredCurrencyYieldList = this.state.unfilteredCurrencyYieldList;
    var currencyClickedTimeSeries = unfilteredCurrencyYieldList.filter(function(currency_snapshot) {
      return currency_snapshot.currency == currency.currency;
    });
    currencyClickedTimeSeries.forEach(function (item, index) {
      item.date = new Date(item.timestamp)
    });
    this.setState({
      selectedCurrencyTimeSeries: currencyClickedTimeSeries
    });
    console.log(currencyClickedTimeSeries);
  };

  handleBackClick = () => {
    this.setState({
      selectedCurrencyTimeSeries: null
    });
  };

  render() {
    const { classes } = this.props;

    const currencyYields = this.state.displayCurrencyYieldList;

    const selectedCurrencyTimeSeries = this.state.selectedCurrencyTimeSeries;

    if(selectedCurrencyTimeSeries == null){

      return (
        <div className={classes.container}>
          <Breadcrumbs
              separator={<NavigateNextIcon fontSize="medium" />}
              aria-label="breadcrumb"
          >
            <Typography variant="h6" color="inherit" className={classes.header}>
                  Compound Your Crypto
              </Typography>
          </Breadcrumbs>
          <List className={classes.list}>
          {currencyYields.map((data) => (
            <ListItem color="inherit" button onClick={(event) => this.handleCurrencyClicked(data, event)}>
              <Typography variant="h6" color="textPrimary">{data.currency}</Typography>
              <Typography className={classes.greenYieldLabel} variant="h6">{(data.yield * 100).toFixed(2) + "%"}</Typography>
            </ListItem>
          ))}
        </List>
        <AppBar
          position="fixed"
          color="inherit"
          className={classes.appBar}
          elevation={0}
        >
          <Toolbar>
            <Link color="inherit" target="_blank" href="https://staked.us/">
              Powered by Staked
            </Link>
            <div className={classes.grow} />
              <Link color="inherit" target="_blank" href="https://github.com/samMitchell650/StakedAPIDemo">
                  <Tooltip title="Source Code">
                      <IconButton edge="end" color="inherit">
                              <CodeIcon />
                      </IconButton>
                  </Tooltip>
              </Link>
          </Toolbar>
        </AppBar>
        </div>
      );

    }else{
      const selectedCurrencyTimeSeries = this.state.selectedCurrencyTimeSeries;
      const selectedCurrency = selectedCurrencyTimeSeries[0];
      console.log(selectedCurrency);
      const realYield = selectedCurrency.yield - selectedCurrency.inflation_total;
      var realYieldLabelClassname = classes.greenYieldLabel;
      if(realYield < 0){
        realYieldLabelClassname = classes.redYieldLabel;
      }
      const dates = selectedCurrencyTimeSeries.map(datum => datum.date.getMonth() + "/" + datum.date.getDate()).reverse();
      const yields = selectedCurrencyTimeSeries.map(datum => Number(datum.yield) * 100);
      const inflations = selectedCurrencyTimeSeries.map(datum => Number(datum.inflation_total) * 100);

      const lineChartData = {
        labels: dates,
        datasets: [
          {
            label: 'Yield',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(76,175,80, 0.4)',
            borderColor: 'rgba(76,175,80, 1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(76,175,80, 1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(76,175,80, 1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: yields
          },
          {
            label: 'Inflation',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(244,67,54, 0.4)',
            borderColor: 'rgba(244,67,54, 1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(244,67,54, 1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(244,67,54, 1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: inflations
          }
        ]
      };

      return (
      <div className={classes.container}>
      <Breadcrumbs
          separator={<NavigateNextIcon fontSize="medium" />}
          aria-label="breadcrumb"
          className={classes.breadcrumb} 
      >

        <Link className={classes.backNavLink} color="inherit" variant="h6" onClick={this.handleBackClick}>
          Compound Your Crypto
        </Link>

        <Typography variant="h6" color="textPrimary">
          {selectedCurrency.currency}
        </Typography>
      </Breadcrumbs>
      <Line className={classes.lineChart} data={lineChartData} />
      <List className={classes.list}>
        <ListItem color="inherit" >
            <Typography color="textPrimary">Nominal Yield</Typography>
            <Typography className={classes.greenYieldLabel} >{(selectedCurrency.yield * 100).toFixed(2) + "%"}</Typography>
        </ListItem>
        <ListItem color="inherit">
          <Typography color="textPrimary">Inflation</Typography>
          <Typography className={classes.redYieldLabel} color="red">{(selectedCurrency.inflation_total * 100).toFixed(2) + "%"}</Typography>
        </ListItem>
        <Divider />
        <ListItem color="inherit">
          <Typography color="textPrimary">Real Yield</Typography>
          <Typography className={realYieldLabelClassname} >{((selectedCurrency.yield - selectedCurrency.inflation_total) * 100).toFixed(2) + "%"}</Typography>
        </ListItem>
    </List>
    <AppBar
      position="fixed"
      color="inherit"
      className={classes.appBar}
      elevation={0}
    >
      <Toolbar>
        <Link color="inherit" target="_blank" href="https://staked.us/">
          Powered by Staked
        </Link>
        <div className={classes.grow} />
          <Link color="inherit" target="_blank" href="https://github.com/samMitchell650/StakedAPIDemo">
              <Tooltip title="Source Code">
                  <IconButton edge="end" color="inherit">
                          <CodeIcon />
                  </IconButton>
              </Tooltip>
          </Link>
      </Toolbar>
    </AppBar>
    </div>
  );
    }
  }
}

YieldsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(YieldsList);
