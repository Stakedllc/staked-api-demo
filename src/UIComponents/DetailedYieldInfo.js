import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Line} from 'react-chartjs-2';
import api from "../api.js";
import api_key from "../api_key.js";

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

class DetailedYieldInfo extends React.Component {

  state = {
    currencyTimeSeries: null
  };

  componentDidMount() {
    const currencySelected = this.props.currencySelected;
    api.get(`/yields/currency/${currencySelected.currency}/timeseries?api_key=${api_key}&interval=1&num_entries=30&extended=true`)
    .then(res => {
      this.setState({
        currencyTimeSeries: res.data.timeseries,
      });
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    const { classes } = this.props;

    const currencySelectedTimeSeries = this.state.currencyTimeSeries;
    const loading = (currencySelectedTimeSeries == null);

    if(loading){
      return(
        <React.Fragment>
          <LinearProgress/>
        </React.Fragment>
      );
    }else{

      const currencySelected = currencySelectedTimeSeries[0];

      const realYield = currencySelected.yield - currencySelected.inflation_total;
      var realYieldLabelClassname = classes.greenYieldLabel;
      if(realYield < 0){
        realYieldLabelClassname = classes.redYieldLabel;
      }

      currencySelectedTimeSeries.forEach(function (item, index) {
        item.date = new Date(item.timestamp)
      });

      const dates = currencySelectedTimeSeries.map(datum => `${datum.date.getMonth() + 1}/${datum.date.getDate()}`).reverse();
      const yields = currencySelectedTimeSeries.map(datum => Number(datum.yield) * 100).reverse();
      const inflations = currencySelectedTimeSeries.map(datum => Number(datum.inflation_total) * 100).reverse();

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
        <React.Fragment>
            <Line className={classes.lineChart} data={lineChartData} />
            <List className={classes.list}>
            <ListItem color="inherit" >
                <Typography color="textPrimary">Nominal Yield</Typography>
                <Typography className={classes.greenYieldLabel} >{(currencySelected.yield * 100).toFixed(2) + "%"}</Typography>
            </ListItem>
            <ListItem color="inherit">
                <Typography color="textPrimary">Inflation</Typography>
                <Typography className={classes.redYieldLabel} color="red">{(currencySelected.inflation_total * 100).toFixed(2) + "%"}</Typography>
            </ListItem>
            <Divider />
            <ListItem color="inherit">
                <Typography color="textPrimary">Real Yield</Typography>
                <Typography className={realYieldLabelClassname} >{((currencySelected.yield - currencySelected.inflation_total) * 100).toFixed(2) + "%"}</Typography>
            </ListItem>
            </List>
        </React.Fragment>
      );
    }
  }
}

DetailedYieldInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DetailedYieldInfo);