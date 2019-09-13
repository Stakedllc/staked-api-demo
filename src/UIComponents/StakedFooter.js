import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CodeIcon from "@material-ui/icons/Code";
import Link from "@material-ui/core/Link";
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  appBar: {
    top: "auto",
    bottom: 0
  }
});

class StakedFooter extends React.Component {

  render() {
    const { classes } = this.props;

    return (
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
              <Link color="inherit" target="_blank" href="https://github.com/Stakedllc/staked-api-demo/tree/delegation_demo">
                  <Tooltip title="Source Code">
                      <IconButton edge="end" color="inherit">
                              <CodeIcon />
                      </IconButton>
                  </Tooltip>
              </Link>
          </Toolbar>
        </AppBar>
    );
  }
}

StakedFooter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StakedFooter);
