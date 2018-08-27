import { second } from "../../../variables/colors"

const frontPageStyle = {
  container: {
    position: 'absolute',
    top: '30%',
    left: '10px',
    textAlign: 'center',
    h2: {
      fontSize: '5rem'
    },
    a: {
      fontSize: '1.4rem'
    }
  },
  button: {
    marginTop: '30px',
    backgroundColor: second,
    '&:hover': {
      backgroundColor: 'rgb(255, 189, 58)'
    }
  }
};

export default frontPageStyle;
