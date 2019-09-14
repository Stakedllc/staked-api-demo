import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Logo from './images/logo.png';

const styles = theme => ({
  backNavLink: {
    cursor: "pointer"
  },
  detailedBreadcrumb: {
    marginBottom: 10
  },
  centered: {
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto"
  },
  title: {
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px"
  }
});

class Navigation extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Avatar alt="Logo" src={Logo} className={classes.centered}/>
        <Typography variant="h6" color="textPrimary" className={classes.title}>Reporting Demo</Typography>
      </React.Fragment>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigation);
