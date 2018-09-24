import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import TextField from '@material-ui/core/TextField';

import buttonContainerStyle from '../styles/buttonContainerStyle';

type Props = {
  onClickLoadFiles: object,
  onClickCalculateAll: object,
  saveExcelFile: object,
  changeScale: object,
  classes: object,
  scale: Long
};

class ButtonContainer extends Component<Props> {
  render() {
    const {
      onClickLoadFiles,
      onClickCalculateAll,
      saveExcelFile,
      changeScale,
      classes,
      scale
    } = this.props;

    return (
      <div className={classes.buttonContainer}>
        <Link to={routes.FrontPage}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            id="goBack"
          >
            {' '}
            Back{' '}
          </Button>
        </Link>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={onClickLoadFiles}
        >
          Load files
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={onClickCalculateAll}
        >
          Calculate All
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={saveExcelFile}
        >
          Save to excel
        </Button>
        <TextField
          required
          id="required"
          label="pixels/microns"
          type="number"
          value={scale}
          onChange={changeScale}
        />
      </div>
    );
  }
}

export default withStyles(buttonContainerStyle)(ButtonContainer);
