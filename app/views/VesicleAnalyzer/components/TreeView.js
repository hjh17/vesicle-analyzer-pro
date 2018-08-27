import React, { Component } from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { Treebeard } from 'react-treebeard';
import withLoadingSpinner from '../../../utils/with/loadingSpinner';

import { treeViewStyle, treeStyle } from '../styles/treeViewStyle';

type Props = {
  classes: object,
  imgData: string,
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
    this.setState({ currentlySelected: node.key });
    this.props.onClickTree(node);
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
    this.setState({ currentlySelected: selected });
    const fileTreeEntry = data.find(e => e.key === selected % data.length);
    this.onToggle(fileTreeEntry, true);
  }

  decrement() {
    const { currentlySelected } = this.state;
    const { data } = this.props;
    let selected = currentlySelected - 1;
    if (selected < 0) {
      selected = data.length + selected;
    }
    this.setState({ currentlySelected: selected });
    const fileTreeEntry = data.find(e => e.key === selected % data.length);
    this.onToggle(fileTreeEntry, true);
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
