import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import imageStyle from '../styles/imageStyle';
import Image from '../components/Image';
import CustomSpinner from '../../../components/Progress/CustomSpinner';

type Props = {
  classes: object,
  res: object
};

class ImageContainer extends Component<Props> {
  render() {
    const {
      res,
      classes,
      onClickLoad,
      loadingOriginal,
      loadingProcessed,
      loadingDetectedCircles,
      originalImg,
      processedImg,
      detectedImg,
      onClickProcess,
      onClickDetect
    } = this.props;
    return (
      <div className={classes.imageContainer}>
        <div className={classes.imageBox}>
          <h1>Original</h1>
          <div className={classes.image}>
            {originalImg ? (
              <Image imgData={originalImg} />
            ) : (
              loadingOriginal && <CustomSpinner message="Loading image" />
            )}
          </div>
          <Button
            onClick={onClickLoad}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            {' '}
            Load image{' '}
          </Button>
        </div>
        <div className={classes.imageBox}>
          <h1>Processed</h1>
          <div className={classes.image}>
            {processedImg ? (
              <Image imgData={processedImg} />
            ) : (
              loadingProcessed && <CustomSpinner message="Processing image..." />
            )}
          </div>
          <Button
          onClick={onClickProcess}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            {' '}
            Process Image{' '}
          </Button>
        </div>
        <div className={classes.imageBox}>
          <h1>Detected Circles</h1>
          <div className={classes.image}>
            {detectedImg ? (
              <Image imgData={detectedImg} />
            ) : (
              loadingDetectedCircles && (
                <CustomSpinner message="Detecting Circles..." />
              )
            )}
          </div>
          <Button
          onClick={onClickDetect}
            className={classes.button}
            variant="contained"
            color="primary" 
          >
            {' '}
            Detect Circles{' '}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(imageStyle)(ImageContainer);
