import React, { Component } from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { Treebeard } from 'react-treebeard';
import withLoadingSpinner from '../../../utils/with/loadingSpinner';

import { treeViewStyle, treeStyle } from '../styles/treeViewStyle';

type Props = {
  data: object
};

const UP_KEY = 38;
const DOWN_KEY = 40;

class TreeView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { currentlySelected: null };
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  onToggle(node, toggled) {
    if ({}.hasOwnProperty.call(node, 'key')) {
      this.setState({ currentlySelected: node.key });
      this.props.onClickTree(node);
    }
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  }

  increment() {
    const { currentlySelected } = this.state;
    const { data } = this.props;
    const selected = currentlySelected + 1;
    const dataLength = data.map(e => e.children.length).reduce((a, b) => a + b);
    this.setState({ currentlySelected: selected });
    let found = 0;
    for (let i = 0; i < data.length; i++) {
      found = data[i].children.find(e => e.key === selected % dataLength);
      if (found) {
        break;
      }
    }
    this.onToggle(found, true);
  }

  decrement() {
    const { currentlySelected } = this.state;
    const { data } = this.props;
    const selected = currentlySelected - 1;
    const dataLength = data.map(e => e.children.length).reduce((a, b) => a + b);
    this.setState({ currentlySelected: selected });
    let found = 0;
    for (let i = 0; i < data.length; i++) {
      found = data[i].children.find(e => e.key === selected % dataLength);
      if (found) {
        break;
      }
    }
    this.onToggle(found, true);
  }

  handleKeyDown = event => {
    switch (event.keyCode) {
      case UP_KEY:
        this.decrement();
        break;
      case DOWN_KEY:
        this.increment();
        break;
      default:
        break;
    }
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        {data && (
          <Treebeard data={data} onToggle={this.onToggle} style={treeStyle} />
        )}
      </div>
    );
  }
}

export default compose(
  withStyles(treeViewStyle),
  withLoadingSpinner('Loading image')
)(TreeView);
