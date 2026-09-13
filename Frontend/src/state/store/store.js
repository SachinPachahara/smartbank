import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/User/Auth/authSlice";
import userReducer from "../features/User/UserData/userSlice";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import thunk from "redux-thunk";
import adminAuthReducer from "../features/Admin/Auth/adminAuthSlice";
import ownerReducer from "../features/Admin/Owner/ownerSlice";
import usersReducer from "../features/Admin/UsersActions/usersSlice";
import accountRequestsReducer from "../features/Admin/AccountRequests/accountRequestsSlice";
import accountReducer from "../features/Account/accountSlice";

// Clean up any stale localStorage left over from previous legacy versions
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem("persist:root");
  } catch (e) {
    // ignore
  }
}

const persistConfig = {
  key: "root",
  storage: storageSession,
  //encrypting state being stored in session storage
  transforms: [
    encryptTransform({
      secretKey: "sprintsBankingSystemUsingREDUXPERSIST",
      onError: function (error) {
        // Handle the error.
        console.log(error);
      },
    }),
  ],
};

const appReducer = combineReducers({
  userAuth: authReducer,
  userData: userReducer,
  userAccount: accountReducer,
  adminAuth: adminAuthReducer,
  ownerData: ownerReducer,
  usersData: usersReducer,
  accountRequests: accountRequestsReducer,
});

export const clearAuthSession = () => {
  try {
    if (persistor) {
      persistor.purge();
    }
  } catch (e) {
    console.error("Persistor purge error:", e);
  }
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage?.clear();
      window.localStorage?.removeItem("persist:root");
    }
  } catch (e) {
    console.error("Storage clear error:", e);
  }
};

// Check if an action is any logout or reset action
const isLogoutAction = (actionType) => {
  if (!actionType || typeof actionType !== "string") return false;
  return actionType.toLowerCase().includes("logout") || actionType === "app/reset";
};

// Remove stored session and reset entire Redux state when logging out
const rootReducer = (state, action) => {
  if (isLogoutAction(action.type)) {
    clearAuthSession();
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
