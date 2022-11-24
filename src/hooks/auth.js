import { message } from "antd";
import FirebaseAPI from "api/FirebaseAPI";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "redux/actions/user";


export default function useAuth() {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.user);

  const signUp = () => {

  };

  const signIn = async data => {
    return await FirebaseAPI.auth.signIn(data).then(res => {
      localStorage.setItem('auth', JSON.stringify(res));
      dispatch(setUser(res));
      return res;
    }).catch(e => {
      switch (e.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message.error('Login failed. The username or password is incorrect!');
          break;
        case 'auth/too-many-requests':
          message.error('Access to this account has been temporarily disabled due to many failed login attempts.', 10);
          break;
        default:
      }
    });
  };

  const signOut = async () => {
    return await FirebaseAPI.auth.signOut().then(() => {
      localStorage.removeItem('auth');
      dispatch(setUser(null));
    }).catch(e => {
      console.log(e);
      message.error('An error is occurred while signing out.');
    });
  };

  return { user, signIn, signOut, signUp };
} 