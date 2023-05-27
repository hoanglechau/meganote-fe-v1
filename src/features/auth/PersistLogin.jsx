// This component allows the user to remain logged in even when they refresh the application
import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import PulseLoader from "react-spinners/PulseLoader";

const PersistLogin = () => {
  const [persist] = usePersist();
  // Get the current access token from the Redux store, which will give us the access that we need
  const token = useSelector(selectCurrentToken);

  // This is specifically for React 18 Strict Mode
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  // Get the 'refresh' function and its resulting statuses from the custom RTK Query hook
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    // useEffect runs twice in Strict Mode
    // React 18 Strict Mode only happens in 'development'
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log("Verifying refresh token!");
        try {
          // Run the 'refresh' function from 'authApiSlice' to get a new access token
          await refresh();
          //const { accessToken } = response.data
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      // If there's no access token (the page is refresh and the state is wiped out) and the user has set 'persist' to true (stayed logged in)
      if (!token && persist) verifyRefreshToken(); // Get a new access token
    }

    return () => (effectRan.current = true);

    // The line below is to avoid an eslint warning regarding the dependency array
    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist: no
    // The user has not set 'persist' to true (stayed logged in)
    console.log("No persist!");
    content = <Outlet />;
  } else if (isLoading) {
    // persist: yes, token: no
    console.log("Loading!");
    content = <PulseLoader color={"#FFF"} />;
  } else if (isError) {
    // persist: yes, token: no
    // This may happen if our access token has expired
    console.log("Error!");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again!</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    // persist: yes, token: yes
    console.log("Success!");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // There's a token, but we haven't initialized the refreshToken mutation yet
    // persist: yes, token: yes
    console.log("Token and uninitialized!");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
