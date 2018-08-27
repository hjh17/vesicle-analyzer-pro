import React, { Component } from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import withLoadingSpinner from '../../../utils/with/loadingSpinner';

import imageStyle from '../styles/imageStyle';

type Props = {
  classes: object,
  imgData: string
};

class Image extends Component<Props> {
  render() {
    const { imgData, classes, title } = this.props;

    return (
      <div>

        <img src={`data:image/png;base64,${imgData}`} alt="original" />
      </div>
    );
  }
}

export default compose(
  withStyles(imageStyle),
  withLoadingSpinner("Loading image")
)(Image);
