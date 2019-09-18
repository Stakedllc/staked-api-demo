import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    height: 240,
    width: 350,
    position: "relative",
    marginLeft: "0px",
    marginRight: "0px",
    marginBottom: "0px"
  },
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
    marginRight: "0px"
  },
  listDetailLabel: {
    position: "relative",
    marginRight: "0px",
    color: "textSecondary"
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

class CurrencyList extends React.Component {

  constructor(props) {
    super(props);
    this.numberWithCommas = this.numberWithCommas.bind(this);
  }

  state = {
    currenciesAdded: null,
    currenciesNotAdded: null,
    notReportingCurrencies: null
  };

  componentDidMount() {
    const currencies = this.props.currencies;
    var reportingCurrencies = currencies.filter((currency) => (typeof currency.account !== "undefined"))
    var notReportingCurrencies = currencies.filter((currency) => (typeof currency.account === "undefined"))
    var currenciesAdded = reportingCurrencies.filter((currency) => currency.account != null) || []
    var currenciesNotAdded = reportingCurrencies.filter((currency) => currency.account == null) || []
    
    this.setState({
      currenciesAdded: currenciesAdded,
      currenciesNotAdded: currenciesNotAdded,
      notReportingCurrencies: notReportingCurrencies
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getYieldString(currency) {
    if(typeof currency.yield_info === "undefined"){
      return `Unavailable`;
    }else{
      return `${(currency.yield_info.yield * 100).toFixed(2)}%`;
    }
  }

  render() {
    const { classes } = this.props;

    const currenciesAdded = this.state.currenciesAdded || [];
    const currenciesNotAdded = this.state.currenciesNotAdded || [];
    const notReportingCurrencies = this.state.notReportingCurrencies || [];

    return (
      <List className={classes.list}>
        <ListItem color="inherit" className={classes.listItemSubheader}>
          <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">Opportunities</Typography>
        </ListItem>
        <div className={classes.container}>
          {currenciesAdded.map((currency) => (
              <React.Fragment>
                <ListItem color="inherit">
                  <ListItemText
                    primary={
                      <React.Fragment className={classes.listText}>
                        <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                      </React.Fragment>
                    }
                    secondary={`${currency.symbol}, Earning ` + this.getYieldString(currency)}
                  />
                  <div className={classes.listDetail}>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography variant="h6" align={'right'} className={classes.listLabel}>{this.numberWithCommas(currency.account.balance)}</Typography>
                        </React.Fragment>
                      }
                      secondary={<React.Fragment>
                        <Typography variant="body2" align={'right'} className={classes.listDetailLabel}>Delegation Balance</Typography>
                      </React.Fragment>}
                    />
                  </div>
                </ListItem>
              </React.Fragment>
            ))}
          {currenciesNotAdded.map((currency) => (
            <React.Fragment>
              <ListItem color="inherit">
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                    </React.Fragment>
                  }
                  secondary={`${currency.symbol}, Yield ` + this.getYieldString(currency)}
                />
                <Button color="primary" className={classes.button} onClick={(event) => this.props.addAccountOpen(currency, event)}>
                  Add Account
                </Button>
              </ListItem>
            </React.Fragment>
          ))}
          {notReportingCurrencies.map((currency) => (
              <React.Fragment>
                <ListItem color="inherit">
                  <ListItemText
                    primary={
                      <React.Fragment className={classes.listText}>
                        <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                      </React.Fragment>
                    }
                    secondary={`${currency.symbol}, Yield ` + this.getYieldString(currency)}
                  />
                  <Button color="primary" disabled className={classes.button}>
                    Unavailable
                  </Button>
                </ListItem>
              </React.Fragment>
            ))}
        </div>
      </List>
    );
  }
}

CurrencyList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CurrencyList);
