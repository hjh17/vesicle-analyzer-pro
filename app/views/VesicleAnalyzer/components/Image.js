import React, { Component } from 'react';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import Slider from '@material-ui/lab/Slider';
import withLoadingSpinner from '../../../utils/with/loadingSpinner';

import imageStyle from '../styles/imageStyle';

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
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(imageStyle),
  withLoadingSpinner('Loading image')
)(Image);
