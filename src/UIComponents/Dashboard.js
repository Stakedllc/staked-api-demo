import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Navigation from "./Navigation.js";
import StakingYieldList from "./StakingYieldList.js";
import DetailedYieldInfo from "./DetailedYieldInfo.js";
import StakedFooter from "./StakedFooter.js";
import LinearProgress from '@material-ui/core/LinearProgress';
import api from "../api.js";
import api_key from "../api_key.js";

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
    currencyYields: null,
    currencySelected: null
  };

  componentDidMount() {
    api.get(`/yields?api_key=${api_key}&extended=true&by_key=false`)
    .then(res => {
      this.setState({
        currencyYields: res.data,
      });
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleCurrencySelected = (currency, event) => {
    this.setState({
      currencySelected: currency,
    });
  };

  handleBackNav = () => {
    this.setState({
      currencySelected: null
    });
  };

  render() {
    const { classes } = this.props;

    const currencyYields = this.state.currencyYields;
    const currencySelected = this.state.currencySelected;

    const loadingCurrencyYields = (currencyYields == null && currencySelected == null);
    const currencyIsSelected = (currencySelected != null);

    var body = null;

    if(loadingCurrencyYields){
      body = <LinearProgress/>;
      console.log('progress');
    }else if(!currencyIsSelected){
      body = <StakingYieldList currencyYields={currencyYields} handleCurrencySelected={this.handleCurrencySelected}/>;
      console.log('list');
    }else{
      body = <DetailedYieldInfo currencySelected={currencySelected} />;
      console.log('detail');
    }

    return (
        <div className={classes.container}>
          <Navigation 
            isShowingYieldList={!currencyIsSelected} 
            currencySelected={currencySelected} 
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
