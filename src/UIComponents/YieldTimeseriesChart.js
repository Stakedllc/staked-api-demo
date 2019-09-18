import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {Line} from 'react-chartjs-2';

const styles = theme => ({
    
});

class YieldTimeseriesChart extends React.Component {

  state = {
    dates: [],
    datasets: []
  };

  componentDidMount() {
    var currencies = this.props.currencies;
    var dates = [];
    var datasets = [];

    if(currencies[0].yield_info != null){

        for (var i = 0; i < currencies.length; i++) {
            currencies[i].yield_info.timeseries.forEach((datum) => {
                dates.push(new Date(datum.timestamp));
            })
            console.log(currencies[i]);
        }
        
        var counts = {};

        for (var i = 0; i < dates.length; i++) {
            var date = `${dates[i].getMonth()+1}/${dates[i].getDate()}`;
            counts[date] = counts[date] ? counts[date] + 1 : 1;
        }

        console.log(counts);

        dates = dates.filter((date) => {
            return(counts[`${date.getMonth()+1}/${date.getDate()}`] == 3)
        })

        dates = dates.sort((a, b) => {
            return a.timestamp - b.timestamp;
        })

        dates = dates.map((date) => {
            return `${date.getMonth()+1}/${date.getDate()}`;
        })

        dates = [...new Set(dates)];

        dates = dates.reverse();

        console.log(dates);

        currencies.forEach((currency) => {
            currency.yield_info.timeseries = currency.yield_info.timeseries.filter((datum) => {
                const datumDate = new Date(datum.timestamp);
                var foundDate = null;
                dates.forEach((date) => {
                    foundDate = dates.find((date) => {
                        return date == `${datumDate.getMonth()+1}/${datumDate.getDate()}`
                    })
                })
                return (typeof foundDate !== "undefined");
            })
        })
        
        currencies.forEach((currency) => {
            console.log(currency);
            const yields = currency.yield_info.timeseries.map(datum => (Number(datum.yield) * 100).toFixed(2)).reverse();
            var dataset = {
                label: currency.chain,
                fill: false,
                lineTension: 0.1,
                backgroundColor: currency.theme,
                borderColor: currency.theme,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: currency.theme,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: currency.theme,
                pointHoverBorderColor: currency.theme,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: yields
            }
            datasets.push(dataset);
        })

        this.setState({
            dates: dates,
            datasets: datasets
        })
    }
  }

  render() {
    const { classes } = this.props;

    const dates = this.state.dates;
    const datasets = this.state.datasets;

      const lineChartData = {
        labels: dates,
        datasets: datasets
      };

      if(dates != null && datasets != null){
        return (
            <React.Fragment>
                <Line className={classes.lineChart} data={lineChartData} />
            </React.Fragment>
          );
      }else{
        return (
            <React.Fragment>
            </React.Fragment>
          );
      }
    }
}

YieldTimeseriesChart.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(YieldTimeseriesChart);
