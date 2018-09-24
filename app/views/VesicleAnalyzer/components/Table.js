import React, { Component } from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import withLoadingSpinner from '../../../utils/with/loadingSpinner';
import tableStyle from '../styles/tableStyle';

class DiameterTable extends Component<Props> {
  render() {
    const { classes, data, scale } = this.props;

    return (
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Cell</TableCell>
              <TableCell numeric>Diameter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((diameter, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx+1}</TableCell>
                <TableCell numeric>{(diameter/scale).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default compose(
  withStyles(tableStyle),
  withLoadingSpinner('Loading data')
)(DiameterTable);
