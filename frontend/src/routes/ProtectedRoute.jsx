import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <p>Loading...</p>;

  if (!isLoggedIn || !user) return <Navigate path={"/auth"} />;

  return children;
};

export default ProtectedRoute;
