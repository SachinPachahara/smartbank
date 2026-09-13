import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout, getAdmin } from "../Admin/Auth/adminAuthSlice";
import { clearAuthSession } from "../../store/store";

export default function UseDetectAdmin() {
  const { info, isError } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (info) {
      const adminData = {
        token: info.token,
        id: info.id,
      };

      dispatch(getAdmin(adminData));
    }
  }, []);

  useEffect(() => {
    if (info && isError) {
      clearAuthSession();
      dispatch(adminLogout());
    }
  }, [info, isError]);

  return info;
}

