import { Layout } from 'antd';
import { createUseStyles } from 'react-jss';
import AdminSidebar from './partial/AdminSidebar';

import Topbar from './partial/Topbar';

const { Content } = Layout;

const useStyles = createUseStyles(theme => ({
  root: {
    height: '100vh'
  }
}));

export default function AdminLayout(props) {
  const classes = useStyles();

  return (
    <Layout className={classes.root}>
      <Topbar showLogo={true} />
      <Layout>
        <AdminSidebar />
        <Content style={{ overflow: 'auto', background: 'white' }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};