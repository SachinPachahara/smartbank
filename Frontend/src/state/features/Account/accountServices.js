import axios from "axios";
import { API_ENDPOINTS } from "../../../config/apiConfig";

const API_URL = API_ENDPOINTS.ACCOUNT;

//Get Account
const getAccount = async (payload) => {
  const res = await axios.get(API_URL + payload.accountId, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Transfer Balance
const transfer = async (payload) => {
  const res = await axios.put(
    API_URL + "/transfer/" + `${payload.from}/` + payload.to,
    payload,
    {
      headers: {
        authorization: `Bearer ${payload.token}`,
      },
    }
  );
  const data = res.data;

  return data;
};

//Deposit
const deposit = async (payload) => {
  const res = await axios.put(
    API_URL + "deposit/" + payload.accountId,
    payload,
    {
      headers: {
        authorization: `Bearer ${payload.token}`,
      },
    }
  );
  const data = res.data;

  return data;
};

//Withdraw
const withdraw = async (payload) => {
  const res = await axios.put(
    API_URL + "withdraw/" + payload.accountId,
    payload,
    {
      headers: {
        authorization: `Bearer ${payload.token}`,
      },
    }
  );
  const data = res.data;

  return data;
};

//Logout
const accountLogout = () => {
  return;
};

const accountServices = {
  getAccount,
  transfer,
  deposit,
  withdraw,
  accountLogout,
};

export default accountServices;
