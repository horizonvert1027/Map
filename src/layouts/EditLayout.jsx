import { Layout } from 'antd';
import Topbar from './partial/Topbar';
import EditSidebar from './partial/EditSidebar';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import Loader from 'components/controls/common/Loader';

const { Content } = Layout;

const useStyles = createUseStyles(theme => ({
  root: {
    height: '100vh'
  },
  container: {
    height: 'calc(100vh - 80px)',
    position: 'relative',
  },
  content: {
    height: '100%',
    overflow: 'auto'
  }
}));

export default function EditLayout(props) {
  const classes = useStyles();
  const { loading, drawingSidebar } = useSelector(state => state.layout);

  return (
    <Layout className={classes.root}>
      <Topbar showLogo={true} />
      <Layout>
        {drawingSidebar && <EditSidebar />}
        <Content className={classes.container}>
          <div className={classes.content}>{props.children}</div>
          <Loader loading={loading} />
        </Content>
      </Layout>
    </Layout>
  );
};