import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import CodeIcon from "@material-ui/icons/Code";
import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Tooltip from '@material-ui/core/Tooltip';
import api from "./api.js";

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
  yieldLabel: {
    //marginLeft: 100,
    position: "absolute",
    right: "20px",
    color: "green"
  },
  appBar: {
        top: "auto",
        bottom: 0
  }
  
});

class YieldsList extends React.Component {

  state = {
    unfilteredCurrencyYieldList: [],
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
        unfilteredCurrencyYieldList: retrievedCurrencyYieldList,
        displayCurrencyYieldList: displayCurrencyYieldList
    });
  }

  handleCurrencyClicked = event => {
  };

  render() {
    const { classes } = this.props;

    const currencyYields = this.state.displayCurrencyYieldList;

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
          <ListItem color="inherit" button>
            <Typography variant="h6" color="textPrimary">{data.currency}</Typography>
            <Typography className={classes.yieldLabel} variant="h6" color="textPrimary">{(data.yield * 100).toFixed(2) + "%"}</Typography>
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
  }
}

YieldsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(YieldsList);
