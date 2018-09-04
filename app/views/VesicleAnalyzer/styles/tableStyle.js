const tableStyle = theme =>  ({
  tableContainer: {
    width: '300px',
    height: '300px',
    border: "thick solid black",
    position: "absolute",
    top: "400px",
    backgroundColor: "white",
    overflowY: 'scroll'
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

export default tableStyle
