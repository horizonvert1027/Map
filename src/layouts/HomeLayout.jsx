import { Layout } from 'antd';
import Loader from 'components/controls/common/Loader';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import HomeSidebar from './partial/HomeSidebar';

import Topbar from './partial/Topbar';

const { Content } = Layout;

const useStyles = createUseStyles(theme => ({
  root: {
    height: '100vh'
  },
  container: {
    height: 'calc(100vh - 80px)',
    background: 'white',
    position: 'relative',
  },
  content: {
    height: '100%',
    overflow: 'auto'
  }
}));

export default function HomeLayout(props) {
  const classes = useStyles();

  const { loading } = useSelector(state => state.layout);

  return (
    <Layout className={classes.root}>
      <Topbar showLogo={true} />
      <Layout>
        <HomeSidebar />
        <Content className={classes.container}>
          <div className={classes.content}>{props.children}</div>
          <Loader loading={loading} />
        </Content>
      </Layout>
    </Layout>
  );
};