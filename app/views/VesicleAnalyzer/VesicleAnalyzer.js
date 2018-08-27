// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { remote } from 'electron';

import fs from 'fs';
import LinearProgress from '@material-ui/core/LinearProgress';
import vesicleAnalyzerStyle from './styles/vesicleAnalyzerStyle';
import routes from '../../constants/routes.json';

import ImageContainer from './containers/ImageContainer';
import TreeView from './components/TreeView';
import LoadingDialog from './components/LoadingDialog';

type Props = {
  classes: object
};

class VesicleAnalyzer extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      imgData: null,
      err: null,
      res: null,
      loadingOriginal: false,
      loadingProcessed: false,
      loadingDetectedCircles: false,
      originalImg: null,
      processedImg: null,
      detectedImg: null,
      treeObject: null,
      completed: 0,
      isCalculating: false
    };
  }

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

  onClickProcess = filePath => {
    this.setState({ loadingProcessed: true });
    window.client
      .invoke('process_image', filePath)
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

  onClickDetect = filePath => {
    this.setState({ loadingDetectedCircles: true });
    window.client
      .invoke('detect_circles', filePath)
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
      })
      .then(this.onClickProcess)
      .then(this.onClickDetect)
      .catch(error => {
        this.setState({ loadingOriginal: false });
        console.log('Caught error from client:', error);
      });
  };

  onClickTest = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      files => {
        const treeObject = [];
        const fileNames = fs.readdirSync(files[0]);
        let totalFiles = fileNames.length
        this.setState({ isCalculating: true });
        fileNames.forEach((file, idx) => {
          if (!file.endsWith('.tif')){
            totalFiles -=1;
            return
          }
          treeObject.push({
            name: file,
            path: `${files[0]}/${file}`,
            key: idx
          });
          this.setState({
            loadingProcessed: true,
            loadingDetectedCircles: true,
            loadingOriginal: true
          });
          window.client
            .invoke('get_original', `${files[0]}/${file}`)
            .then(result => {
              const res = JSON.parse(result);
              return this.setState({
                originalImg: res.img_data,
                loadingOriginal: false
              });
            })
            .then(res => this.onClickProcess(`${files[0]}/${file}`))
            .then(res => this.onClickDetect(`${files[0]}/${file}`))
            .then(res =>
              this.setState(prevState => {
                if (prevState.completed + 1 / totalFiles < 1)
                  return {
                    completed: prevState.completed + 1 / totalFiles
                  };
                return {
                  completed: prevState.completed + 1 / totalFiles,
                  isCalculating: false
                };
              })
            )
            .catch(error => {
              this.setState({ loadingOriginal: false });
              this.setState(prevState => ({
                completed: prevState.completed + (1 / fileNames.length) * 100
              }));
              console.log('Caught error from client:', error);
            });
        });
        this.setState({ treeObject });
      }
    );
  };

  /*   onClickTest = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      files => {
        const treeObject = [];
        fs.readdirSync(files[0]).forEach((file, idx) => {
          
          treeObject.push({'name': file, 'path': `${files[0]}/${file}`, 'key': idx})
        })
        this.setState({treeObject})
      }
      
    );
  }; */

  onClickTree = treeEntry => {
    this.setState({
      loadingProcessed: true,
      loadingDetectedCircles: true,
      loadingOriginal: true
    });
    window.client
      .invoke('get_original', treeEntry.path)
      .then(result => {
        const res = JSON.parse(result);
        return this.setState({
          originalImg: res.img_data,
          loadingOriginal: false
        });
      })
      .then(res => this.onClickProcess(treeEntry.path))
      .then(res => this.onClickDetect(treeEntry.path))
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
      detectedImg,
      treeObject,
      completed,
      isCalculating
    } = this.state;

    return (
      <div data-tid="container">
        <div className={classes.treeViewContainer}>
          <TreeView data={treeObject} onClickTree={this.onClickTree} />
        </div>
        <div className={classes.container}>
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
            onClick={this.onClickTest}
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
        <LinearProgress
          color="secondary"
          variant="determinate"
          value={completed * 100}
        />
        <LoadingDialog isCalculating={isCalculating} completed={completed} />
      </div>
    );
  }
}

export default withStyles(vesicleAnalyzerStyle)(VesicleAnalyzer);
