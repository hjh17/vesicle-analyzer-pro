import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Slider from '@material-ui/lab/Slider';
// import Slider from '@material-ui/lab/Slider';

import imageStyle from '../styles/imageStyle';
import Image from '../components/Image';
import {
  paramsDetectCircles,
  paramsDataProcessing,
  defaultParams
} from '../../../variables/paramControl';

type Props = {
  classes: object,
  loading: object,
  originalImg: string | null,
  processedImg: string | null,
  detectedImg: string | null,
  currentlySelectedData: object,
  changeParams: object
};

class ImageContainer extends Component<Props> {
  generateImageBox = (
    imageData,
    title,
    isLoading,
    classes,
    parameterControl,
    changeParams,
    params
  ) => (
    <div className={classes.imageBox}>
      <h1>{title}</h1>
      <div className={classes.image}>
        <Image imgData={imageData} isLoading={isLoading} />
      </div>
      {parameterControl &&
        parameterControl.map((entry, key) =>
          this.generateParameterControl(
            entry,
            classes,
            changeParams,
            params,
            key
          )
        )}
    </div>
  );

  generateParameterControl = (entry, classes, changeParams, params, key) => (
    <div className={classes.parameterControl} key={key}>
      <span className={classes.parameterControlText}>{entry.name}</span>
      <Slider
        min={entry.min}
        max={entry.max}
        className={classes.parameterControlSlider}
        value={params[entry.variable]}
        aria-labelledby="label"
        onChange={(event, value) =>
          changeParams({
            [entry.variable]: value
          })
        }
      />
      <span className={classes.parameterControlValue}>
        {params[entry.variable]}
      </span>
    </div>
  );

  render() {
    const {
      classes,
      loading,
      originalImg,
      processedImg,
      detectedImg,
      currentlySelectedData,
      changeParams
    } = this.props;

    let params = null;

    if (currentlySelectedData !== null) {
      params = currentlySelectedData.params;
    } else {
      params = defaultParams;
    }
    return (
      <div className={classes.imageContainer}>
        {currentlySelectedData && (
          <h3>
            selected condition: {currentlySelectedData.condition}, position:{' '}
            {currentlySelectedData.position}
          </h3>
        )}
        {this.generateImageBox(originalImg, 'Original', loading[0], classes)}

        {this.generateImageBox(
          processedImg,
          'Processed',
          loading[1],
          classes,
          paramsDataProcessing,
          changeParams,
          params
        )}

        {this.generateImageBox(
          detectedImg,
          'Detected Circles',
          loading[2],
          classes,
          paramsDetectCircles,
          changeParams,
          params
        )}
      </div>
    );
  }
}

export default withStyles(imageStyle)(ImageContainer);
