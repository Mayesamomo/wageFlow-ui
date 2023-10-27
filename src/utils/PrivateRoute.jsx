/* eslint-disable react/prop-types */
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
const PrivateRoutes = () => {
   const {user} = useAuth();
   return user ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRoutes
// const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />
//     }
//   />
// );


