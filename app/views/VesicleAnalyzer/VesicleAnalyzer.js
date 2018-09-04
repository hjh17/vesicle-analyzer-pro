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
import Table from "./components/Table";

import { callRPCPromised, callRPC } from '../../utils/api/rpc';
import { defaultParams } from "../../variables/paramControl"
import saveToExcel from "./saveToExcel"

type Props = {
  classes: object
};

class VesicleAnalyzer extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      loadingOriginal: false,
      loadingProcessed: false,
      loadingDetectedCircles: false,
      originalImg: null,
      processedImg: null,
      detectedImg: null,
      treeObject: null,
      completed: 0,
      isCalculating: false,
      selectedParams: defaultParams,
      selectedImagePath: null,
      selectedPosition: 1,
      selectedCondition: 1,
      selectedTime: 1
    };
  }


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

  onClickLoadFiles = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      files => {
        const treeObject = [];
        let fileNames = fs.readdirSync(files[0]);
        fileNames = fileNames.filter(entry => entry.endsWith('tif'));
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
                  position,
                  diameters: []
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
              position,
              diameters: []
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

  changeParams = value => {
    const {
      treeObject,
      selectedCondition,
      selectedPosition,
      selectedImagePath,
      selectedTime
    } = this.state;
    const oldEntry =
      treeObject[selectedCondition - 1].children[selectedPosition - 1];

    const newEntry = { ...oldEntry, params: { ...oldEntry.params, ...value } };
    const newTreeObject = treeObject;
    newTreeObject[selectedCondition - 1].children[
      selectedPosition - 1
    ] = newEntry;
    this.setState({ treeObject: newTreeObject, selectedParams: { ...oldEntry.params, ...value } });
    callRPCPromised('get_processed_image', selectedImagePath, newEntry.params)
      .then(res => {
        this.setState({ processedImg: res.img_data });
        return null;
      })
      .catch(err => console.log(err));
    callRPCPromised('get_detected_circles', selectedImagePath, newEntry.params)
      .then(res => {
        console.log(res);
        this.setState({ detectedImg: res.img_data });
        this.updateDiameters(selectedCondition, selectedPosition, selectedTime, res.diameters)
        return null;
      })
      .catch(err => console.log(err));
  };

  updateDiameters = (condition, position, time, diameters) => {
    const {
      treeObject,
    } = this.state;
    const oldEntry =
      treeObject[condition - 1].children[position - 1];
      const newEntry = { ...oldEntry, diameters };
      const newTreeObject = treeObject;
      newTreeObject[condition - 1].children[
        position - 1
      ] = newEntry;
      this.setState({ treeObject: newTreeObject });
  };

  getIndexByPath = (path) => {
    const { treeObject } = this.state;
    let entry = null;
    treeObject.forEach(condition => condition.children.forEach(position => {
      if (position.path === path) {
        entry = position
      }
    }))
    return [entry.condition, entry.position, entry.time]
  }

  onClickCalculateAll = () => {
    const {
      treeObject,
      selectedParams
    } = this.state;
    const imagePaths = []
    treeObject.forEach(condition => condition.children.forEach(position => imagePaths.push(position.path)))


    window.client.invoke('calculate_all', imagePaths, selectedParams, (error, res, more) => {
      this.updateDiameters(...this.getIndexByPath(res.path), res.diameters)
        this.setState({
          originalImg: res.img_data,
          processedImg: res.processed_img,
          detectedImg: res.cirlces
        });
        this.setState(prevState => ({
          completed: prevState.completed + 1 / imagePaths.length
        }));
        return null;
      });
      this.setState({ isCalculating: false });
    }



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
      .then(() => {
        this.onClickProcess(treeEntry.path);
        return null;
      })
      .then(() => {
        this.onClickDetect(treeEntry.path);
        return null;
      })
      .catch(error => {
        this.setState({ loadingOriginal: false });
        console.log('Caught error from client:', error);
      });
  };

  saveExcelFile = () => {
    const {treeObject} = this.state
    const content = "lol"

    // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    remote.dialog.showSaveDialog({title:"Save analysis as Excel", defaultPath:"analysis.xlsx"}, (fileName) => {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }
    
        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(fileName, content, (err) => {
            if(err){
                alert(`An error ocurred creating the file ${ err.message}`)
            }
            console.log(fileName)
            saveToExcel(fileName, treeObject)
                        
            alert("The file has been succesfully saved");
        });
    }); 
  }

  render() {
    const { classes } = this.props;
    const {
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
      currentlySelectedData =
        treeObject[selectedCondition - 1].children[selectedPosition - 1];
    }
    const loading = [loadingOriginal, loadingProcessed, loadingDetectedCircles];

    return (
      <div data-tid="container">
        <div className={classes.treeViewContainer}>
          <TreeView data={treeObject} onClickTree={this.onClickTree} />
        </div>
        <div className={classes.container}>
          <ImageContainer
            changeParams={this.changeParams}
            currentlySelectedData={currentlySelectedData}
            onClickProcess={this.onClickProcess}
            onClickDetect={this.onClickDetect}
            originalImg={originalImg}
            processedImg={processedImg}
            detectedImg={detectedImg}
            loading={loading}
          />
          { currentlySelectedData && <Table data={currentlySelectedData.diameters} />}

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
            onClick={this.onClickCalculateAll}
          >
            Calculate All
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.saveExcelFile}
          >
            Save to excel
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
