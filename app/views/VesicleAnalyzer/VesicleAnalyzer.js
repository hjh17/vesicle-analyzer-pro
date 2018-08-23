// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import vesicleAnalyzerStyle from './styles/vesicleAnalyzerStyle';
import routes from '../../constants/routes.json';


const remote = require('electron').remote;

const fs = remote.require('fs');

type Props = {
  classes: object
};

class VesicleAnalyzer extends Component<Props> {
  props: Props;

  state = {
      img : null,
      err: null,
      res: null
  }

/*   componentDidMount() {
    console.log(window);
    window.client.invoke('asdf', "/home/hjortur/Downloads/400gxCond1_Image001_ch00.tif", (error, result) => {
      console.log(error, JSON.parse(result));
      const res = JSON.parse(result)
      this.setState({img: res.img_data})
    });
  } */

  onClick = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
            {name: 'Images', extensions: ['tif', 'png', 'jpg']}
          ]
      },
      files => {
        if (files !== undefined) {
            window.client.invoke('find_circles', files[0], (error, result) => {
                console.log(error, JSON.parse(result));
                const res = JSON.parse(result)
                this.setState({img: res.img_data, res})

                if (error) {
                    this.setState({err: error})
                }
              });

/*             console.log(files[0])
            const img = fs.readFileSync(files[0]).toString('base64')
            this.setState({img}) */
        }
      }
    );
  };

  render() {

    const { classes } = this.props;
    const {img, } = this.state

    return (
      <div className={classes.container} data-tid="container">
        <h2>Vesicle View</h2>
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
    {img && <img style={{height:"300px", width:"300px"}} src={`data:image/png;base64,${img}`} alt="lol" /> }
      </div>
    );
  }
}

export default withStyles(vesicleAnalyzerStyle)(VesicleAnalyzer);
