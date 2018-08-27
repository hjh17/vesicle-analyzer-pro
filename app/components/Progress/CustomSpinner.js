import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

class CustomSpinner extends React.Component {
  render() {
    const { message } = this.props;
    return (
      <span>
        <CircularProgress
          style={{
            margin: '50px auto',
            display: 'block'
          }}
          size={100}
          color="secondary"
        />
        <p style={{ textAlign: 'center' }}>{message}</p>
      </span>
    );
  }
}

export default CustomSpinner;
