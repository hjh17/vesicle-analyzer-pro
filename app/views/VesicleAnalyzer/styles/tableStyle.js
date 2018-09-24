const tableStyle = theme =>  ({
  tableContainer: {
    width: '250px',
    height: '250px',
    border: "thick solid black",
    position: "absolute",
    top: "450px",
    left: "150px",
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
