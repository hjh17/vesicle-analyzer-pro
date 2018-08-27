// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import frontPageStyle from './styles/frontPageStyle';
import routes from '../../constants/routes.json';

type Props = {
  classes: object
};

class FrontPage extends Component<Props> {
  props: Props;

  state = {
      msg: "No response from python"
  }

/*   componentDidMount() {
    console.log(window);
    window.client.invoke('hello', 'Hello from python:  ', (error, result) => {
        this.setState({msg: result})
      console.log(error, result);
    });
    window.client.invoke('', (error, result) => {
      console.log(error, result);
    });
  } */

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container} data-tid="container">
        <h2>Vesicle Analyzer Pro</h2>
        <Link to={routes.VESICLE_ANALYZER}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
          >
            {' '}
            Get Started{' '}
          </Button>
        </Link>

      </div>
    );
  }
}

export default withStyles(frontPageStyle)(FrontPage);
