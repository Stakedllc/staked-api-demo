import React, { Component } from 'react'
import Chart from "chart.js";
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// Credit: https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a
// https://github.com/chartjs/Chart.js/blob/master/samples/charts/line/basic.html

const styles = theme => ({
    container: {

    }
  });

class LineChart extends Component {
    chartRef = React.createRef();
    
    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");
        const dates = this.props.data.map(datum => datum.date.toString());
        const yields = this.props.data.map(datum => Number(datum.yield) * 100).reverse();
        const inflations = this.props.data.map(datum => Number(datum.inflation_total) * 100).reverse();
        new Chart(myChartRef, {
            type: "line",
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Yield',
                        backgroundColor: green[0],
                        borderColor: green[0],
                        data: yields,
                        fill: false,
                    }, {
                        label: 'Inflation',
                        fill: false,
                        backgroundColor: red,
                        borderColor: red,
                        data: inflations,
                    }
                ]
            },
            options: {
				responsive: true,
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Day'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
        });
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

LineChart.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(LineChart);