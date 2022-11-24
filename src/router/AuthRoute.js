import useAuth from "hooks/auth";
import { Navigate, useLocation } from "react-router-dom";

export function AuthRoute({ type, children }) {
  let { user } = useAuth();
  let location = useLocation();

  if (type === 'user') {
    return user ? children : <Navigate to="/login" state={{ from: location }} replace />
  } else {
    return children;
  }
}