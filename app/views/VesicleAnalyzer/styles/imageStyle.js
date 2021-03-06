import { second } from '../../../variables/colors';

const imageStyle = {
  imageContainer: {
    width: '100%',
    height: '650px'
  },
  imageBox: {
    display: 'inline-block',
    margin: '10px',
    height: '500px',
    verticalAlign: 'top',
    '& img': {
      borderRadius: '25px',
      height: '300px',
      width: '300px',
      boxShadow:
      "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    }
  },
  image: {
    display: 'inline-block',
    height: '350px',
    width: '300px',
    
  },
  button: {
    display: 'block',
    margin: '0 auto',
    backgroundColor: second,
    '&:hover': {
      backgroundColor: 'rgb(255, 189, 58)'
    }
  },
  slider: {
    position: 'relative',
    "& div[role=main]": {
      backgroundColor: 'black',
    },
    margin: '20px',
    "& button": {
      backgroundColor: second
    },
    "& div:nth-child(1)": {
      backgroundColor: 'black'
    }
  },
  track: {
    backgroundColor: "green"
  },
  parameterControl: {
    display:'block'
  },
  parameterControlText: {
    display: 'inline-block',
    width: "30%",
  },
  parameterControlSlider:  {
    display: 'inline-block',
    width: "50%",
    "& button": {
      backgroundColor: "white"
    }
  },
  parameterControlValue: {
    display: 'inline-block',
    width:"10%"
  }
};

export default imageStyle;
