import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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
  header: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit,
    //marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  textField: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    margin: "auto",
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 50,
    width: 125,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
  },
  buttonLoading: {
    backgroundColor: "white",
    "&$selected, &$selected:hover": {
      backgroundColor: "white"
    }
  },
  buttonError: {
    backgroundColor: "white",
    "&$selected, &$selected:hover": {
      backgroundColor: "white"
    }
  }
});

class APIKeyForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleContinueClicked = this.handleContinueClicked.bind(this);
  }

  state = {
    api_key: "",
    loading: false,
    error: false
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleContinueClicked = event => {
    if (!this.state.loading) {
      this.setState(
        {
          loading: true
        },
        () => {
          const api_key = this.state.api_key;
          const confirmedAPIKey = this.props.confirmedAPIKey;
          
          api
            .get(`/yields?api_key=${api_key}&extended=true&by_key=false`)
            .then(res => {
              console.log(confirmedAPIKey);
              confirmedAPIKey(api_key, res.data);
              console.log(res);
            })
            .catch(error => {
              console.log(error);
              this.setState({
                loading: false,
                error: true
              });
            });
        }
      );
    }
  };

  render() {
    const { classes } = this.props;

    const loading = this.state.loading;
    const error = this.state.error;

    var buttonClassName;
    var buttonText;

    if (!loading && !error) {
      buttonClassName = classes.button;
      buttonText = "Continue";
    } else if (!error) {
      buttonClassName = classes.buttonLoading;
      buttonText = "Connecting to Staked API...";
    } else {
      buttonClassName = classes.buttonError;
      buttonText = "Error";
    }

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Typography variant="h6" color="inherit" className={classes.header}>
          Staked API Demo
        </Typography>
        <TextField
          id="outlined-api-key"
          label="Enter API Key"
          className={classes.textField}
          value={this.state.api_key}
          onChange={this.handleChange("api_key")}
          margin="normal"
          variant="outlined"
          disabled={loading}
        />
        <Button
          className={buttonClassName}
          disabled={loading || error}
          onClick={this.handleContinueClicked}
        >
          {buttonText}
        </Button>
      </form>
    );
  }
}

APIKeyForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(APIKeyForm);
