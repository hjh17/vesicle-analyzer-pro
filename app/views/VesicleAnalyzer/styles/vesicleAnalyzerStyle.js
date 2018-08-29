import { second } from "../../../variables/colors"

const vesicleAnalyzerStyle = {
  container: {
    display: 'inline-block',
    top: '10%',
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
  },
  treeViewContainer: {
    display:"inline-block",
    verticalAlign: 'top',
    marginTop: '30px',
    marginLeft: '10px',
    border: '3px solid white',
    borderRadius: '10px',
    height: '500px',
    boxShadow:
    "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    overflowX: 'hidden',
    overflowY: 'scroll'
    
  }
};

export default vesicleAnalyzerStyle;
