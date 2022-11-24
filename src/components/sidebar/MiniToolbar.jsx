/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setDeactivateAll, setEditMode, setShapes, setSnapshot } from "redux/actions/drawing";
import { setDrawingSidebar } from "redux/actions/layout";

import HandPng from "assets/images/hand.png";
import PencilPng from "assets/images/pencil.png";
import CirclePng from "assets/images/circle.png";
import PolygonPng from "assets/images/polygon.png";
import RulerPng from "assets/images/ruler.png";
import WallPng from "assets/images/wall.png";
import LinePng from "assets/images/line.png";
import RectanglePng from "assets/images/rectangle.png";
import LabelPng from "assets/images/laser.png";
import IconPng from "assets/images/access-point.png";
import UndoPng from "assets/images/undo.png";
import RedoPng from "assets/images/redo.png";
import CameraPng from "assets/images/camera.png";
import CaretLeftBigPng from "assets/images/caret-left-big.png";
import CaretRightBigPng from "assets/images/caret-right-big.png";
import BluePrintBtn from "assets/images/blueprint.png";
import { createUseStyles } from "react-jss";
import { Button } from "antd";
import { hideContextMenu } from "redux/actions/map";

const useStyles = createUseStyles((theme) => ({
  root: {
    top: 60,
    position: 'absolute',
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
  },
  toolBtn: {
    marginBottom: 10,
    width: 60,
    height: 60,
    minWidth: 60,
    background: "white",
    borderRadius: 5,
    border: 'none',
    boxShadow: '1px 1px 4px #00000066!important',
    "&.active, &:hover": {
      background: '#47AAEE',
    },
    "&.active img, &:hover img": {
      filter: "brightness(0) invert(1)",
    },
    "&[disabled]": {
      "& img": {
        filter: "brightness(0) invert(0.7)",
      }
    },
    "& img": {
      width: 40,
    },
  },
  undoBtn: {
    position: 'absolute',
    '& img': {
      width: 'auto',
      position: 'absolute',
      top: 5,
      left: 5,
    }
  },
  redoBtn: {
    position: 'absolute',
    '& img': {
      width: 'auto',
      position: 'absolute',
      top: 30,
      left: 25,
    }
  },
  toggleVisibleBtn: {
    width: 24,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    cursor: "pointer",
    backgroundColor: "#edf8fe",
    borderLeft: "1px solid #e2e2e2",
    marginLeft: -15,
    marginTop: 70
  },
  otherButtons: {
    position: "absolute",
    top: 140,
    left: 70,
    display: 'flex',
    '& button': {
      marginRight: 10,
      width: 60,
      minWidth: 60,
      height: 60,
      borderRadius: 5,
      border: 'none',
      "&.active, &:hover": {
        background: '#47AAEE',
      },
      "&.active img, &:hover img": {
        filter: "brightness(0) invert(1)",
      },
      '& img': {
        width: 40
      }
    }
  },
}));

export default function MiniToolbar(props) {
  const classes = useStyles();
  const { shapes, editMode, snapshots, snapshot } = useSelector(state => state.drawing);
  const { drawingSidebar } = useSelector(state => state.layout);

  const activeShape = shapes.find(i => i.active === true);
  // const { activeShape, sidebar, editMode } = props
  const dispatch = useDispatch();

  const [showOtherButtons, setShowOtherButtons] = useState(false);

  const buttons = [
    { id: "camera", icon: CameraPng, editMode: "camera-add" },
    { id: "normal", icon: HandPng, editMode: "normal" },
    { id: "pencil", icon: PencilPng, editMode: "pencil" },
    { id: "blueprint", icon: BluePrintBtn, editMode: "blueprint" },
    { id: "icon", icon: IconPng, editMode: "icon" },
    { id: "label", icon: LabelPng, editMode: "label-add" },
    { id: "ruler", icon: RulerPng, editMode: "ruler-add" },
  ];

  const otherButtons = [
    { id: "polygon", icon: PolygonPng, editMode: "polygon-add" },
    { id: "circle", icon: CirclePng, editMode: "circle-add" },
    { id: "polyline", icon: LinePng, editMode: "polyline-add" },
    { id: "rectangle", icon: RectanglePng, editMode: "rectangle-add" },
    { id: "wall", icon: WallPng, editMode: "wall-add" },
  ];

  const handleClick = (button) => {
    if (button.editMode) {
      if (button.id === "pencil") {
        setShowOtherButtons(!showOtherButtons);
      }
      dispatch(setEditMode(button.editMode));
    }
    dispatch(setDeactivateAll());
  };

  const handleToggleVisible = () => {
    if (drawingSidebar) {
      dispatch(setDrawingSidebar(null));
    } else {
      dispatch(setDrawingSidebar(activeShape?.type ? activeShape.type : 'index'));
    }
  }

  const handleUndo = () => {
    if (snapshot > 0) {
      dispatch(setSnapshot(snapshot - 1));
    }
  }
  const handleRedo = () => {
    if (snapshot < snapshots.length - 1) {
      dispatch(setSnapshot(snapshot + 1));
    }
  }

  useEffect(() => {
    if (editMode !== 'pencil') {
      setShowOtherButtons(false);
    }
    if (editMode === 'icon') {
      dispatch(setDrawingSidebar('icon'));
    }
    dispatch(hideContextMenu());
  }, [editMode])

  useEffect(() => {
    if (snapshots[snapshot]) {
      dispatch(setShapes(snapshots[snapshot]));
    }
  }, [snapshot]);

  useEffect(() => {
    if (snapshots.length > 0) {
      dispatch(setSnapshot(snapshots.length - 1));
    }
  }, [snapshots]);

  return (
    <div className={classes.root} style={{ left: drawingSidebar ? 335 : 15 }}>
      {buttons.map((button, index) => {
        return (
          <Button
            className={`${classes.toolBtn}${button.id === editMode.split('-')[0] ? ' active' : ''}`}
            variant="contained"
            key={index}
            icon={<img src={button.icon} alt="" />}
            onClick={() => handleClick(button)}
          />
        );
      })}

      <div className="pos-relative">
        <Button
          className={`${classes.toolBtn} ${classes.undoBtn}`}
          style={{ top: 0, left: 0, clipPath: 'polygon(0 0, 0 97%, 97% 0)' }}
          variant="contained"
          icon={<img src={UndoPng} alt="" />}
          disabled={snapshot === 0}
          onClick={handleUndo}
        />
        <Button
          className={`${classes.toolBtn} ${classes.redoBtn}`}
          style={{ top: 0, left: 0, clipPath: 'polygon(0 103%, 103% 103%, 103% 0)' }}
          variant="contained"
          icon={<img src={RedoPng} alt="" />}
          disabled={snapshot === snapshots.length - 1}
          onClick={handleRedo}
        />
      </div>

      {showOtherButtons && (
        <div className={classes.otherButtons}>
          {otherButtons.map((button, index) => {
            return (
              <Button
                className={`${classes.otherToolBtn} ${button.id === editMode.split('-')[0] ? "active" : ""}`}
                variant="contained"
                key={index}
                icon={<img src={button.icon} alt="" />}
                onClick={() => handleClick(button)}
              />
            );
          })}
        </div>
      )}

      <div className={classes.toggleVisibleBtn} onClick={handleToggleVisible}>
        <img src={drawingSidebar ? CaretLeftBigPng : CaretRightBigPng} alt="" />
      </div>
    </div>
  );
}