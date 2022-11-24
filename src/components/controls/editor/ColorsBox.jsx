import React from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { addSnapshot, setShapeProps } from 'redux/actions/drawing';

const useStyles = createUseStyles((theme) => ({
  root: {
    // width: 76,
    // padding: 5,
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    width: 20,
    height: 20,
    margin: 4,
    border: '1px solid grey',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid #47AAEE'
    },
    '&.active': {
      // borderRadius: 2,
      border: '3px solid black'
    }
  }
}));

export default function ColorsBox({ name, disable = false, type=1 }) {
  name = name || 'color';
  const classes = useStyles();
  const dispatch = useDispatch();

  const colors = type?["#B5121B", "#FFCC33", "#FF5700", "#D60C8C", "#FF0033", "#72CDF4", "#8DC63F", "#D6E03D", "#000000", "#FFFFFF"]
                      :["#B5121B", "#FFCC33", "#FF5700", "#D60C8C", "#FF0033", "#72CDF4", "#8DC63F", "#D6E03D", "#47aaee", "#FFFFFF"];;

  const shape = useSelector(state => state.drawing.shapes).find(v => v.active === true);

  const setActiveColor = (e, color) => {
    if (shape && !disable) {
      dispatch(setShapeProps({ id: shape.id, [name]: color }));
      dispatch(addSnapshot());
    }
  }

  return (
    <div className={classes.root} style={disable?{backgroundColor: 'grey'}:{}}>
      {colors.map((c, index) =>
        <div key={index}
          className={`${classes.item}${shape && c === shape[name] ? ' active' : ''}`}
          style={{ background: c }}
          onClick={(e) => setActiveColor(e, c)} />
      )}
    </div>
  );
};