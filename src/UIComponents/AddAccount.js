import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const styles = theme => ({

});
  
class AddAccount extends React.Component {

    constructor(props) {
        super(props);
        this.handleDialogueClose = this.handleDialogueClose.bind(this);
        this.handleDialogueSubmit = this.handleDialogueSubmit.bind(this);
    }

    state = {
        address: null
    };

    handleDialogueClose = () => {
        this.setState({
            address: null
        })
        this.props.addAccountClose();
    };

    handleDialogueSubmit = () => {
        this.setState({
            address: null,
        });
        const address = this.state.address;
        this.props.getReporting(this.props.chain, address);
    };

    render() {

        const open = this.props.open;
        const chain = this.props.chain;

        return (
            <Dialog open={open} onClose={this.handleDialogueClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add {chain} Account</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To get reporting on your delegation to Staked, please input your {chain} address
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Your address"
                    onChange={(event) => this.setState({address: event.target.value})}
                    fullWidth
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleDialogueClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.handleDialogueSubmit} color="primary">
                    Add Account
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AddAccount.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddAccount);
