import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  listDetail: {
    position: "absolute",
    right: "20px"
  }
});

class CurrencyList extends React.Component {

  state = {
    currenciesAdded: null,
    currenciesNotAdded: null
  };

  componentDidMount() {
    const currencies = this.props.currencies;
    const currenciesAdded = currencies.filter((currency) => currency.account != null)
    const currenciesNotAdded = currencies.filter((currency) => currency.account == null)
    this.setState({
      currenciesAdded: currenciesAdded,
      currenciesNotAdded: currenciesNotAdded
    });
  }

  render() {
    const { classes } = this.props;

    const currenciesAdded = this.state.currenciesAdded || [];
    const currenciesNotAdded = this.state.currenciesNotAdded || [];

    return (
      <List className={classes.list}>
        {currenciesAdded.map((currency) => (
            <ListItem color="inherit" button onClick={(event) => this.props.handleCurrencySelected(currency, event)}>
              <Typography variant="h6" color="textPrimary">{currency.chain}</Typography>
              <Typography variant="h6">{currency.balance + " " + currency.symbol + 's'}</Typography>
            </ListItem>
          ))}
        {currenciesNotAdded.map((currency) => (
          <ListItem color="inherit" button onClick={(event) => this.props.handleCurrencyAddAccountDialogueOpen(currency, event)}>
            <Typography variant="h6" color="textPrimary">{currency.chain}</Typography>
            <Typography variant="h6" color="textPrimary" className={classes.listDetail}>
                Add Account
            </Typography>      
          </ListItem>
        ))}
      </List>
    );
  }
}

/*
<Button variant="outlined" color="primary">
              Add Account
            </Button>
*/

CurrencyList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CurrencyList);
