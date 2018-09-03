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

import { callRPCPromised, callRPC } from '../../utils/api/rpc';

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
      isCalculating: false,
      minBinaryThreshold: 40,
      maxBinaryThreshold: 100,
      gaussianBlur: 0,
      dp: 2.4,
      centerDistance: 40,
      minRadius: 10,
      maxRadius: 80,
      selectedImagePath: null,
      selectedPosition: 1,
      selectedCondition: 1,
      selectedTime: 1
    };
  }

  onClickLoad = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['tif', 'png', 'jpg'] }]
      },
      files => {
        this.setState({ loadingOriginal: true });
        if (files !== undefined) {
          callRPCPromised('get_original', files[0])
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
      .invoke_promised('process_image', filePath)
      .then(result => {
        const res = JSON.parse(result);
        this.setState({
          processedImg: res.img_data,
          loadingProcessed: false
        });
        return null;
      })
      .catch(error => {
        this.setState({ loadingProcessed: false });
        console.log('Caught error from client:', error);
      });
  };

  onClickDetect = filePath => {
    this.setState({ loadingDetectedCircles: true });
    window.client
      .invoke_promised('detect_circles', filePath)
      .then(result => {
        const res = JSON.parse(result);
        this.setState({
          detectedImg: res.img_data.detected_circles,
          loadingDetectedCircles: false
        });
        return null;
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
        this.setState({
          originalImg: res.img_data,
          loadingOriginal: false
        });
        return null;
      })
      .then(() => {
        this.onClickProcess();
        return null;
      })
      .then(() => {
        this.onClickDetect();
        return null;
      })
      .catch(error => {
        this.setState({ loadingOriginal: false });
        console.log('Caught error from client:', error);
      });
  };

  onClickLoadFiles = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      files => {
        const treeObject = [];
        let fileNames = fs.readdirSync(files[0]);
        fileNames = fileNames.filter(entry => entry.endsWith('tif'));
        const totalFiles = fileNames.length;
        this.setState({ isCalculating: true });
        const params = {
          minBinaryThreshold: 40,
          maxBinaryThreshold: 100,
          gaussianBlur: 0,
          dp: 2.4,
          centerDistance: 40,
          minRadius: 10,
          maxRadius: 80
        };
        fileNames.forEach((file, idx) => {
          const condition = parseInt(file.match(/c\d*/)[0].slice(1), 10);
          const position = parseInt(file.match(/p\d*/)[0].slice(1), 10);
          const time = parseInt(file.match(/t\d*/)[0].slice(1), 10);
          const hasCondition =
            treeObject.filter(entry => entry.name === `condition ${condition}`)
              .length > 0;
          if (!hasCondition) {
            treeObject.push({
              name: `condition ${condition}`,
              children: [
                {
                  name: `position ${position}`,
                  path: `${files[0]}/${file}`,
                  time,
                  params,
                  condition,
                  position
                }
              ]
            });
          } else {
            const index = treeObject.findIndex(
              entry => entry.name === `condition ${condition}`
            );
            treeObject[index].children.push({
              name: `position ${position}`,
              path: `${files[0]}/${file}`,
              time,
              params,
              condition,
              position
            });
          }
        });
        let keyValue = 0;
        for (let i = 0; i < treeObject.length; i += 1) {
          for (let j = 0; j < treeObject[i].children.length; j += 1) {
            treeObject[i].children[j] = {
              ...treeObject[i].children[j],
              key: keyValue
            };
            keyValue += 1;
          }
        }

        this.setState({ treeObject, isCalculating: false });
      }
    );
  };

  changeParams = (condition, position, time, value) => {
    console.log(value)
    const { treeObject } = this.state
    const oldEntry = treeObject[condition-1].children[position-1]

    const newEntry = {...oldEntry, params:{...oldEntry.params, ...value}}
    const newTreeObject = treeObject
    newTreeObject[condition-1].children[position-1] = newEntry
    this.setState({treeObject: newTreeObject})

  };

  onClickTest = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      files => {
        this.setState({ isCalculating: true });
        const treeObject = [];
        fs.readdirSync(files[0]).forEach((file, idx) => {
          treeObject.push({
            name: file,
            path: `${files[0]}/${file}`,
            key: idx
          });
        });
        window.client.invoke('test', treeObject, (error, res, more) => {
          this.setState({
            originalImg: res.img_data,
            processedImg: res.processed_img,
            detectedImg: res.cirlces
          });
          this.setState(prevState => ({
            completed: prevState.completed + 1 / 200
          }));
          return null;
        });
        this.setState({ isCalculating: false });
      }
    );
  };

  onClickTree = treeEntry => {
    this.setState({
      loadingProcessed: true,
      loadingDetectedCircles: true,
      loadingOriginal: true,
      selectedImagePath: treeEntry.path,
      selectedKey: treeEntry.key,
      selectedPosition: treeEntry.position,
      selectedCondition: treeEntry.condition,
      selectedTime: treeEntry.time
    });
    window.client
      .invoke_promised('get_original', treeEntry.path)
      .then(result => {
        const res = JSON.parse(result);
        this.setState({
          originalImg: res.img_data,
          loadingOriginal: false
        });
        return null;
      })
      .then(res => {
        this.onClickProcess(treeEntry.path);
        return null;
      })
      .then(res => {
        this.onClickDetect(treeEntry.path);
        return null;
      })
      .catch(error => {
        this.setState({ loadingOriginal: false });
        console.log('Caught error from client:', error);
      });
  };

  onChangeMinBinaryThreshold = (event, value) => {
    this.setState({ minBinaryThreshold: value });
    window.client
      .invoke_promised(
        'get_processed_image',
        this.state.selectedImagePath,
        value,
        this.state.maxBinaryThreshold,
        this.state.gaussianBlur
      )
      .then(res => {
        this.setState({ processedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
  };

  onChangeMaxBinaryThreshold = (event, value) => {
    this.setState({ maxBinaryThreshold: value });
    window.client
      .invoke_promised(
        'get_processed_image',
        this.state.selectedImagePath,
        this.state.minBinaryThreshold,
        value,
        this.state.gaussianBlur
      )
      .then(res => {
        this.setState({ processedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
  };

  onChangeGaussianBlur = (event, value) => {
    this.setState({ gaussianBlur: value });
    window.client
      .invoke_promised(
        'get_processed_image',
        this.state.selectedImagePath,
        this.state.minBinaryThreshold,
        this.state.maxBinaryThreshold,
        value
      )
      .then(res => {
        this.setState({ processedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
  };

  onChangeDp = (event, value) => {
    this.setState({ dp: value });
    window.client
      .invoke_promised(
        'get_detected_circles',
        this.state.selectedImagePath,
        this.state.minBinaryThreshold,
        this.state.maxBinaryThreshold,
        this.state.gaussianBlur,
        value,
        this.state.centerDistance,
        this.state.minRadius,
        this.state.maxRadius
      )
      .then(res => {
        this.setState({ detectedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
  };

  onChangeCenterDistance = (event, value) => {
    this.setState({ centerDistance: value });
    window.client
      .invoke_promised(
        'get_detected_circles',
        this.state.selectedImagePath,
        this.state.minBinaryThreshold,
        this.state.maxBinaryThreshold,
        this.state.gaussianBlur,
        this.state.dp,
        value,
        this.state.minRadius,
        this.state.maxRadius
      )
      .then(res => {
        this.setState({ detectedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
  };

  onChangeMinRadius = (event, value) => {
    this.setState({ minRadius: value });
    window.client
      .invoke_promised(
        'get_detected_circles',
        this.state.selectedImagePath,
        this.state.minBinaryThreshold,
        this.state.maxBinaryThreshold,
        this.state.gaussianBlur,
        this.state.dp,
        this.state.centerDistance,
        value,
        this.state.maxRadius
      )
      .then(res => {
        console.log(res);
        this.setState({ detectedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
  };

  onChangeMaxRadius = (event, value) => {
    this.setState({ maxRadius: value });
    window.client
      .invoke_promised(
        'get_detected_circles',
        this.state.selectedImagePath,
        this.state.minBinaryThreshold,
        this.state.maxBinaryThreshold,
        this.state.gaussianBlur,
        this.state.dp,
        this.state.centerDistance,
        this.state.minRadius,
        value
      )
      .then(res => {
        this.setState({ detectedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
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
      isCalculating,
      selectedPosition,
      selectedCondition
    } = this.state;
    let currentlySelectedData = null;
    if (treeObject !== null) {
      currentlySelectedData = treeObject[selectedCondition-1].children[selectedPosition-1];
  }

    return (
      <div data-tid="container">
        <div className={classes.treeViewContainer}>
          <TreeView data={treeObject} onClickTree={this.onClickTree} />
        </div>
        <div className={classes.container}>
          <ImageContainer
            changeParams={this.changeParams}
            currentlySelectedData={currentlySelectedData}
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
            onChangeMinBinaryThreshold={this.onChangeMinBinaryThreshold}
            onChangeMaxBinaryThreshold={this.onChangeMaxBinaryThreshold}
            onChangeGaussianBlur={this.onChangeGaussianBlur}
            onChangeDp={this.onChangeDp}
            onChangeCenterDistance={this.onChangeCenterDistance}
            onChangeMinRadius={this.onChangeMinRadius}
            onChangeMaxRadius={this.onChangeMaxRadius}
            minBinaryThreshold={this.state.minBinaryThreshold}
            maxBinaryThreshold={this.state.maxBinaryThreshold}
            gaussianBlur={this.state.gaussianBlur}
            dp={this.state.dp}
            centerDistance={this.state.centerDistance}
            minRadius={this.state.minRadius}
            maxRadius={this.state.maxRadius}
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
            onClick={this.onClickLoadFiles}
          >
            Load files
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.onClickTest}
          >
            Calculate All
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
