import { Carousel, Layout } from 'antd';
import { createUseStyles } from 'react-jss';

import SlidePng1 from 'assets/images/temp/slide1.png';
import SlidePng2 from 'assets/images/temp/slide2.png';

import Topbar from './partial/Topbar';
import Loader from 'components/controls/common/Loader';
import { useSelector } from 'react-redux';

const { Sider, Content } = Layout;

const useStyles = createUseStyles(theme => ({
  root: {
    height: '100vh'
  },
  sider: {
    height: '100%',
    background: '#EDF8FE',
    position: 'relative'
  },
  content: {
    height: '100%',
    overflow: 'auto',
    paddingBottom: 130
  }
}));

export default function AuthLayout(props) {
  const classes = useStyles();

  const { loading } = useSelector(state => state.layout);

  return (
    <Layout className={classes.root}>
      <Sider width={640} theme="light" className={classes.sider}>
        <div className={classes.content}>{props.children}</div>
        <Loader loading={loading} />
      </Sider>
      <Layout>
        <Topbar showLogo={false} />
        <Content>
          <Carousel autoplay >
            <img src={SlidePng1} alt="slide" />
            <img src={SlidePng2} alt="slide" />
          </Carousel>
        </Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </Layout>
  );
};