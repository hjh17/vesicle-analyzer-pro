import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import imageStyle from '../styles/imageStyle';

type Props = {
  classes: object,
  res: object
};

class LoadingDialog extends Component<Props> {
  render() {
    const { isCalculating, completed } = this.props;
    console.log(parseInt(completed * 100))
    return (
      <Dialog
        open={isCalculating}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <CircularProgress variant="static" value={parseInt(completed * 100)} />
          <DialogContentText>
            Calculating {parseInt(completed * 100)}%
          </DialogContentText>
          <LinearProgress color="primary" />
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(imageStyle)(LoadingDialog);
