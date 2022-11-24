import React from 'react';
import { Divider, Layout } from 'antd';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import CameraEditor from 'components/sidebar/CameraEditor';
import PolygonEditor from 'components/sidebar/PolygonEditor';
import EditorTopbar from 'components/controls/EditorTopbar';
import PolylineEditor from 'components/sidebar/PolylineEditor';
import CircleEditor from 'components/sidebar/CircleEditor';
import LabelEditor from 'components/sidebar/LabelEditor';
import WallEditor from 'components/sidebar/WallEditor';
// import RulerEditor from 'components/sidebar/RulerEditor';
import BlueprintEditor from 'components/sidebar/BlueprintEditor';
import ShapeList from 'components/sidebar/ShapeList';
import RectangleEditor from 'components/sidebar/RectangleEditor';
import PointEditor from 'components/sidebar/PointEditor';
import IconEditor from 'components/sidebar/IconEditor';
const { Sider } = Layout;

const useStyles = createUseStyles(({
  root: {
    position: 'absolute',
    zIndex: 1,
    background: '#EDF8FE',
    overflow: 'auto',
    height: 'calc(100% - 80px)',
    // padding: 15,
    paddingTop: 60,
    '& .ant-form-item-label': {
      padding: 0
    },
    '& .ant-form-item': {
      margin: 0
    },
    '& .ant-input-suffix': {
      color: '#bbb'
    }
  },
  tempOverlay: {
    background: '#edf8fe',
    width: 320,
    height: 60,
    position: 'fixed',
    top: 80,
    zIndex: 1,
  }
}));

export default function EditSidebar(props) {
  const classes = useStyles();
  const { drawingSidebar } = useSelector(s => s.layout);

  return (
    <Sider width={320} theme="light" className={classes.root}>
      {drawingSidebar !== 'index' && <EditorTopbar />}

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />

      {drawingSidebar === 'index' && <ShapeList />}
      {drawingSidebar === 'camera' && <CameraEditor />}
      {drawingSidebar === 'polygon' && <PolygonEditor />}
      {drawingSidebar === 'polyline' && <PolylineEditor />}
      {drawingSidebar === 'circle' && <CircleEditor />}
      {drawingSidebar === 'rectangle' && <RectangleEditor />}
      {drawingSidebar === 'label' && <LabelEditor />}
      {drawingSidebar === 'wall' && <WallEditor />}
      {drawingSidebar === 'blueprint' && <BlueprintEditor />}
      {drawingSidebar === 'icon' && <IconEditor />}
      {drawingSidebar === 'point' && <PointEditor />}

      <div className={classes.tempOverlay}></div>
    </Sider>
  );
};