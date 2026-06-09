import { useEffect } from 'react';
import Navbar from './components/Navbar';
import AppRoute from './routes/AppRoute';
import { useDispatch } from 'react-redux';
import { axiosInstance } from './config/axiosInstance';
import { setUser } from './store/features/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        let me = await axiosInstance.get("/auth/me");
        if (me) {
          dispatch(setUser(me?.data?.user));
        }
      } catch (err) {
        console.log("error in /me route /login first");
      }
    })();
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <AppRoute />
    </div>
  )
}

export default App