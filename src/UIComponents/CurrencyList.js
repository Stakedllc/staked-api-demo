import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from '@material-ui/core/Avatar';
import Cosmos from './images/Cosmos.png';
import Tezos from './images/Tezos.png';
import Dash from './images/Dash.png';

const styles = theme => ({
  listDetail: {
    position: "absolute",
    right: "10px"
  },
  avatar: {
    position: "absolute",
    left: "0px"
  },
  subheader: {
    position: "relative"
  },
  listText: {
    position: "relative",
    marginLeft: "40px"
  },
  listItem: {
    padding: "10px"
  },
  listItemSubheader: {
    paddingTop: "10px",
    paddingBottom: "20px"
  }
});

class CurrencyList extends React.Component {

  constructor(props) {
    super(props);
    this.numberWithCommas = this.numberWithCommas.bind(this);
    this.getImageFromChain = this.getImageFromChain.bind(this);
  }

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

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getImageFromChain(chainName){
    switch(chainName){
      case "Cosmos":
        return Cosmos;
      case "Tezos":
        return Tezos;
      case "Dash":
        return Dash;
      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;

    const currenciesAdded = this.state.currenciesAdded || [];
    const currenciesNotAdded = this.state.currenciesNotAdded || [];

    return (
      <List className={classes.list}>
        <ListItem color="inherit" className={classes.listItemSubheader}>
          <Typography variant="subtitle2" className={classes.avatar} color="textSecondary">Currencies</Typography>
        </ListItem>
        {currenciesAdded.map((currency) => (
            <React.Fragment>
              <ListItem color="inherit" className={classes.listItem}>
                <Avatar alt="Logo" className={classes.avatar} src={this.getImageFromChain(currency.chain)}/>
                <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
                <Typography variant="h6" className={classes.listDetail}>{this.numberWithCommas(currency.account.balance) + " " + currency.symbol + 's'}</Typography>
              </ListItem>
            </React.Fragment>
          ))}
        {currenciesNotAdded.map((currency) => (
          <React.Fragment>
            <ListItem color="inherit" className={classes.listItem} button onClick={(event) => this.props.addAccountOpen(currency, event)}>
              <Avatar alt="Logo" className={classes.avatar} src={this.getImageFromChain(currency.chain)}/>
              <Typography variant="h6" color="textPrimary" className={classes.listText}>{currency.chain}</Typography>
              <Typography variant="h6" color="textPrimary" className={classes.listDetail}>
                Add Account
              </Typography>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    );
  }
}

CurrencyList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CurrencyList);
