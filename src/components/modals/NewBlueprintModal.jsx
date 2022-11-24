import React from 'react';
import { Button, Modal, Typography } from 'antd';
import { createUseStyles } from 'react-jss';
import Dragger from 'antd/lib/upload/Dragger';
import PicturePng from 'assets/images/picture.png';
import { useDispatch, useSelector } from 'react-redux';
import { setEditMode } from 'redux/actions/drawing';

const useStyles = createUseStyles(({
  root: {

  },
  dropzone: {
    '& .ant-upload-drag-container': {
      display: 'flex! important',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15
    },
    '& img': {
      width: 60,
      margin: 30
    }
  }
}));

export default function NewBlueprintModal({ open, setOpen, handleUpload }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { editMode } = useSelector(state => state.drawing);
  return (
    <Modal
      centered
      title={`Dodaj nowy rzut budynku`}
      visible={editMode === 'blueprint'}
      onCancel={() => dispatch(setEditMode('normal'))}
      footer={null}
    >
      <Dragger
        className={classes.dropzone}
        showUploadList={false}
        beforeUpload={handleUpload}
        accept={['.png', '.jpg']}
      >
        <Typography>Przeciągnij plik tutaj lub wybierz plik z dysku</Typography>
        <img src={PicturePng} alt="blueprint" />
        <Button type="primary">Wybierz z dysku</Button>
      </Dragger>
    </Modal>
  );
};