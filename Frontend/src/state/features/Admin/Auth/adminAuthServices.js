import axios from "axios";
import { API_ENDPOINTS } from "../../../../config/apiConfig";

const API_URL = API_ENDPOINTS.ADMINS;

//Login Admin
const adminLogin = async (adminData) => {
  const res = await axios.post(API_URL + "login", adminData, {
    headers: {
      "content-type": "application/json",
    },
  });
  const data = res.data;

  return data;
};

//Logout
const adminLogout = () => {
  return;
};

//Get Admin
const getAdmin = async (adminData) => {
  const res = await axios.get(API_URL + adminData.id, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update Admin
const updateAdmin = async (adminData) => {
  const res = await axios.put(API_URL + adminData.id, adminData, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

const adminAuthServices = {
  adminLogin,
  adminLogout,
  getAdmin,
  updateAdmin,
};

export default adminAuthServices;
