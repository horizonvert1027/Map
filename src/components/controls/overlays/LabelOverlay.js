/* eslint-disable react-hooks/exhaustive-deps */
import { OverlayView } from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme) => ({
  root: {

  },
  label: {
    whiteSpace: 'pre',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  editor: {
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    background: 'transparent',
    border: 'none',
    display: 'block',
    color: 'white',
    textShadow: `-1px -1px black, -1px 1px black, 1px 1px black, 1px -1px black, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black`
  }
}));

export default function LabelOverlay({ position, label, offset = [0, 0], onChange, color, borderColor, backgroundColor, fontSize, readonly }) {
  const classes = useStyles();
  const editor = useRef();
// console.log(offset)
  const [editorOpen, setEditorOpen] = useState(false);
  const [text, setText] = useState('');
  // const [offsetXY, setOffsetXY] = useState([0, 0]);
  const handleChange = e => {
    setText(e.target.value);
  }
  const handleKeyUp = e => {
    if (e.ctrlKey && e.code === 'Enter') {
      handleEditorClose();
    }
  }
  const handleEditorOpen = () => {
    if (!readonly) {
      setEditorOpen(true);
    }
  }
  const handleEditorClose = () => {
    if (onChange) onChange(text);
    setEditorOpen(false)
  }

  useEffect(() => {
    if (editorOpen) {
      editor.current.focus();
    }
  }, [editorOpen]);

  useEffect(() => {
    setText(label);
  }, [label]);

  // useEffect(() => {
  //   if (offsetXY) {
  //     console.log(offsetXY)
  //     setOffsetXY(offset);
  //   }
  // }, [offsetXY]);

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <>
        {!editorOpen &&
          <div
            children={text}
            className={classes.label}
            style={{
              marginLeft: offset[0] ,
              marginTop: offset[1] ,
              cursor: readonly ? '' : 'pointer',
              color: color,
              fontSize: 16 * fontSize,
              padding: fontSize * 2,
              backgroundColor: backgroundColor || 'none',
              textShadow: `-1px -1px ${borderColor}, -1px 1px ${borderColor}, 1px 1px ${borderColor}, 1px -1px ${borderColor}, -1px 0 ${borderColor}, 0 1px ${borderColor}, 1px 0 ${borderColor}, 0 -1px ${borderColor}`
            }}
            onDoubleClick={handleEditorOpen}
          />
        }

        {editorOpen &&
          <textarea
            ref={editor}
            rows={text.split('\n').length}
            value={text}
            size={text.length}
            className={classes.editor}
            style={{
              marginTop: offset.y,
              marginLeft: offset.x,
              fontSize: 16 * fontSize,
            }}
            onChange={handleChange}
            onMouseDown={e => { e.stopPropagation() }}
            onKeyUp={handleKeyUp}
            onBlur={handleEditorClose}
          />
        }
      </>
    </OverlayView>
  );
}