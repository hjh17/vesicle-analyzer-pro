// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { remote } from 'electron';
import vesicleAnalyzerStyle from './styles/vesicleAnalyzerStyle';
import routes from '../../constants/routes.json';

import ImageContainer from './containers/ImageContainer';

type Props = {
  classes: object
};

class VesicleAnalyzer extends Component<Props> {
  props: Props;

  state = {
    imgData: null,
    err: null,
    res: null,
    loadingOriginal: false,
    loadingProcessed: false,
    loadingDetectedCircles: false,
    originalImg: null,
    processedImg: null,
    detectedImg: null
  };

  /*   componentDidMount() {
    console.log(window);
    window.client.invoke('asdf', "/home/hjortur/Downloads/400gxCond1_Image001_ch00.tif", (error, result) => {
      console.log(error, JSON.parse(result));
      const res = JSON.parse(result)
      this.setState({img: res.img_data})
    });
  } */

  /*   componentWillMount = () => {
    window.client
      .invoke(
        'find_circles',
        '/home/hjortur/Downloads/400gxCond1_Image001_ch00.tif'
      )
      .then(result => {
        const res = JSON.parse(result);
        return this.setState({ res });
      })
      .catch(error => console.log('Caught error from client:', error));
  }; */

  onClickLoad = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['tif', 'png', 'jpg'] }]
      },
      files => {
        this.setState({ loadingOriginal: true });
        if (files !== undefined) {
          console.log(files[0]);
          window.client
            .invoke('get_original', files[0])
            .then(result => {
              const res = JSON.parse(result);
              return this.setState({
                originalImg: res.img_data,
                loadingOriginal: false
              });
            })
            .catch(error => {
              this.setState({ loadingOriginal: false });
              console.log('Caught error from client:', error);
            });
        }
      }
    );
  };

  onClickProcess = () => {
    this.setState({ loadingProcessed: true });
    window.client
      .invoke('process_image')
      .then(result => {
        const res = JSON.parse(result);
        return this.setState({
          processedImg: res.img_data,
          loadingProcessed: false
        });
      })
      .catch(error => {
        this.setState({ loadingProcessed: false });
        console.log('Caught error from client:', error);
      });
  };

  onClickDetect = () => {
    this.setState({ loadingDetectedCircles: true });
    window.client
      .invoke(
        'detect_circles'
      )
      .then(result => {
        const res = JSON.parse(result);
        return this.setState({
          detectedImg: res.img_data.detected_circles,
          loadingDetectedCircles: false
        });
      })
      .catch(error => {
        this.setState({ loadingDetectedCircles: false });
        console.log('Caught error from client:', error);
      });
  };

  onClickCalculate = () => {
    this.setState({ loadingProcessed: true });
    window.client
    .invoke(
      'get_original',
      '/home/hjortur/workspace/vesicle_analyzer/test.tif'
    )
      .then(result => {
        const res = JSON.parse(result);
        return this.setState({
          originalImg: res.img_data,
          loadingOriginal: false
        });
      }).then(this.onClickProcess).then(this.onClickDetect)
      .catch(error => {
        this.setState({ loadingOriginal: false });
        console.log('Caught error from client:', error);
      });

  };

  render() {
    const { classes } = this.props;
    const {
      res,
      loadingOriginal,
      loadingProcessed,
      loadingDetectedCircles,
      originalImg,
      processedImg,
      detectedImg
    } = this.state;
    return (
      <div className={classes.container} data-tid="container">
        <ImageContainer
          onClickLoad={this.onClickLoad}
          onClickProcess={this.onClickProcess}
          onClickDetect={this.onClickDetect}
          originalImg={originalImg}
          processedImg={processedImg}
          detectedImg={detectedImg}
          loadingOriginal={loadingOriginal}
          loadingProcessed={loadingProcessed}
          loadingDetectedCircles={loadingDetectedCircles}
          res={res}
        />
        <Link to={routes.FrontPage}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
          >
            {' '}
            Back{' '}
          </Button>
        </Link>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={this.onClick}
        >
          Load files a
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={this.onClickCalculate}
        >
          Calculate
        </Button>
      </div>
    );
  }
}

export default withStyles(vesicleAnalyzerStyle)(VesicleAnalyzer);
