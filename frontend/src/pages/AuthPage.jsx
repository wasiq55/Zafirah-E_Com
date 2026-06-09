import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [flag, setflag] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user came here to update role (from navbar "Become Seller")
    const shouldShowRegister =
      location.state?.showRegister || location.search.includes("register=true");
    if (shouldShowRegister) {
      setflag(true);
    }
  }, [location]);

  return (
    <div>
      {flag ? (
        <RegisterForm setflag={setflag} />
      ) : (
        <LoginForm setflag={setflag} />
      )}
    </div>
  );
};

export default AuthPage;
