import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
// import Slider from '@material-ui/lab/Slider';

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
              loadingProcessed && (
                <CustomSpinner message="Processing image..." />
              )
            )}
          </div>
          <div className={classes.parameterControl}>
            <span className={classes.parameterControlText}>
              Binary Threshold (min):
            </span>
            <Slider
              min={0}
              max={255}
              className={classes.parameterControlSlider}
              value={this.props.minBinaryThreshold}
              aria-labelledby="label"
              onChange={this.props.onChangeMinBinaryThreshold}
            />
            <span className={classes.parameterControlValue}>
              {this.props.minBinaryThreshold}
            </span>
          </div>
          <div className={classes.parameterControl}>
            <span className={classes.parameterControlText}>
              Binary Threshold (max):
            </span>
            <Slider
              min={0}
              max={255}
              className={classes.parameterControlSlider}
              value={this.props.maxBinaryThreshold}
              aria-labelledby="label"
              onChange={this.props.onChangeMaxBinaryThreshold}
            />
            <span className={classes.parameterControlValue}>
              {this.props.maxBinaryThreshold}
            </span>
          </div>
          <div className={classes.parameterControl}>
            <span className={classes.parameterControlText}>Gaussian Blur:</span>
            <Slider
              min={0}
              max={20}
              className={classes.parameterControlSlider}
              value={this.props.gaussianBlur}
              aria-labelledby="label"
              onChange={this.props.onChangeGaussianBlur}
            />
            <span className={classes.parameterControlValue}>
              {this.props.gaussianBlur}
            </span>
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
          <div className={classes.parameterControl}>
            <span className={classes.parameterControlText}>dp:</span>
            <Slider
              min={0}
              max={10}
              className={classes.parameterControlSlider}
              value={this.props.dp}
              aria-labelledby="label"
              onChange={this.props.onChangeDp}
            />
            <span className={classes.parameterControlValue}>
              {this.props.dp}
            </span>
          </div>
          <div className={classes.parameterControl}>
            <span className={classes.parameterControlText}>
              Center distance (min):
            </span>
            <Slider
              min={0}
              max={1000}
              className={classes.parameterControlSlider}
              value={this.props.centerDistance}
              aria-labelledby="label"
              onChange={this.props.onChangeCenterDistance}
            />
            <span className={classes.parameterControlValue}>
              {this.props.centerDistance}
            </span>
          </div>
          <div className={classes.parameterControl}>
            <span className={classes.parameterControlText}>Radius (min):</span>
            <Slider
              min={1}
              max={300}
              className={classes.parameterControlSlider}
              value={this.props.minRadius}
              aria-labelledby="label"
              onChange={this.props.onChangeMinRadius}
            />
            <span className={classes.parameterControlValue}>
              {this.props.minRadius}
            </span>
            <div className={classes.parameterControl}>
              <span className={classes.parameterControlText}>
                Radius (max):
              </span>
              <Slider
                min={20}
                max={400}
                className={classes.parameterControlSlider}
                value={this.props.maxRadius}
                aria-labelledby="label"
                onChange={this.props.onChangeMaxRadius}
              />
              <span className={classes.parameterControlValue}>
                {this.props.maxRadius}
              </span>
            </div>
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
