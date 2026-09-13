import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, userLogout } from "../User/UserData/userSlice";
import { logout } from "../User/Auth/authSlice";
import { clearAuthSession } from "../../store/store";

export default function UseDetectUser() {
  const { user } = useSelector((state) => state.userAuth);
  const { isError } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const userData = {
        token: user.token,
        id: user.id,
      };

      dispatch(getUser(userData));
    }
  }, [user]);

  useEffect(() => {
    if (user && isError) {
      clearAuthSession();
      dispatch(logout());
      dispatch(userLogout());
    }
  }, [user, isError]);

  return user;
}

