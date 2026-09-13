import axios from "axios";
import { API_ENDPOINTS } from "../../../../config/apiConfig";

const API_URL = API_ENDPOINTS.ADMINS;

//Register Admin
const adminRegister = async (payload) => {
  const res = await axios.post(API_URL, payload, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });

  const data = res.data;

  return data;
};

//Get All Admins
const getAllAdmins = async (adminData) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Admin
const deleteAdmin = async (adminData) => {
  const res = await axios.delete(API_URL + adminData.id, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update Admin Role
const updateAdminRole = async (adminData) => {
  const res = await axios.put(
    API_URL + "updaterole/" + adminData.id,
    adminData,
    {
      headers: {
        authorization: `Bearer ${adminData.token}`,
      },
    }
  );
  const data = res.data;

  return data;
};

//Logout
const ownerLogout = () => {
  return;
};

const ownerServices = {
  getAllAdmins,
  deleteAdmin,
  updateAdminRole,
  adminRegister,
  ownerLogout,
};

export default ownerServices;
