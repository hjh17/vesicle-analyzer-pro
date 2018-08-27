import React from 'react';
import CustomSpinner from '../../components/Progress/CustomSpinner';

const withLoadingSpinner = message => Component => {
  class withLoadingSpinner extends React.Component {
    render() {
      return !this.props.isLoading ? (
        <Component {...this.props} />
      ) : (
        <CustomSpinner message={message} />
      );
    }
  }
  return withLoadingSpinner;
};

export default withLoadingSpinner;
