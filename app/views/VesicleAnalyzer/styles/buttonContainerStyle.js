import { second } from '../../../variables/colors';

const buttonContainerStyle = {
  buttonContainer: {
    width: '100%',
    height: '650px',
    display: 'inline'
  },
  button: {
    display: 'block',
    backgroundColor: second,
    '&:hover': {
      backgroundColor: 'rgb(255, 189, 58)'
    }
  }
};

export default buttonContainerStyle;