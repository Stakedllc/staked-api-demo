import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const styles = theme => ({
  backNavLink: {
    cursor: "pointer"
  },
  detailedBreadcrumb: {
    marginBottom: 10
  }
});

class Navigation extends React.Component {


  render() {
    const { classes } = this.props;

    const isShowingYieldList = this.props.isShowingYieldList;

    if(isShowingYieldList){

      return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="medium" />}
            aria-label="breadcrumb"
        >
            <Typography variant="h6" color="inherit">
                Compound Your Crypto
            </Typography>
        </Breadcrumbs>
      );

    }else{

      const currencySelected = this.props.currencySelected;

      return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="medium" />}
            aria-label="breadcrumb"
            className={classes.detailedBreadcrumb} 
        >
            <Link className={classes.backNavLink} color="inherit" variant="h6" onClick={this.props.handleBackNav}>
                Compound Your Crypto
            </Link>
            <Typography variant="h6" color="textPrimary">
                {currencySelected.currency}
            </Typography>
        </Breadcrumbs>
      );
    }
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigation);
