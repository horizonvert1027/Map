import { Link as ReactLink } from 'react-router-dom';
// import { createUseStyles } from 'react-jss'

// const useStyles = createUseStyles(theme => ({

// }));

export default function Link(props) {
  // const classes = useStyles();

  return (
    <ReactLink {...props} />
  );
};