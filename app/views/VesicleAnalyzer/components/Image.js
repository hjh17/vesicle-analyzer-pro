import React, { Component } from 'react';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import Slider from 'react-compound-slider'
import withLoadingSpinner from '../../../utils/with/loadingSpinner';

import imageStyle from '../styles/imageStyle';
import { Rail, Handle, Track } from './slider'

type Props = {
  classes: object,
  imgData: string
};

const domain = [0, 10]
const defaultValues = [0]

class Image extends Component<Props> {
  state = {
    values: defaultValues.slice(),
    update: defaultValues.slice(),
  }

  onUpdate = update => {
    this.setState({ update })
  }

  onChange = values => {
    this.setState({ values })
  }


  render() {
    const { imgData, classes, title } = this.props;
    const {  state: { values, update } } = this


    return (
      <React.Fragment>
        <img src={`data:image/png;base64,${imgData}`} alt="original" />
        <Slider
          mode={2}
          step={1}
          domain={domain}
          className={classes.slider}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Slider.Rail>
            {({ getRailProps }) => <Rail getRailProps={getRailProps} />}
          </Slider.Rail>
          <Slider.Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Slider.Handles>
          <Slider.Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Slider.Tracks>
        </Slider>
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(imageStyle),
  withLoadingSpinner('Loading image')
)(Image);
