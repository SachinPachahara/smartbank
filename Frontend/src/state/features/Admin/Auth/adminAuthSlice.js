import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminAuthServices from "./adminAuthServices";

const initialState = {
  info: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  sessionExpired: false,
};

//Login
export const adminLogin = createAsyncThunk(
  "auth/admin/login",
  async (adminData, thunkAPI) => {
    try {
      return await adminAuthServices.adminLogin(adminData);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Get Admin
export const getAdmin = createAsyncThunk(
  "auth/admin/getAdmin",
  async (adminData, thunkAPI) => {
    try {
      return await adminAuthServices.getAdmin(adminData);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Admin
export const updateAdmin = createAsyncThunk(
  "auth/admin/updateAdmin",
  async (adminData, thunkAPI) => {
    try {
      return await adminAuthServices.updateAdmin(adminData);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const adminLogout = createAsyncThunk("auth/admin/logout", async () => {
  adminAuthServices.adminLogout();
});

export const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    resetAdminAuthStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
        state.sessionExpired = false;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.info = action.payload;
        state.sessionExpired = false;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.info = null;
        state.sessionExpired = false;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.info = null;
        state.sessionExpired = false;
      })
      .addCase(getAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.sessionExpired = false;
        state.info = {
          ...state.info,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.info = null;
        state.sessionExpired = true;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
        state.sessionExpired = false;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Your Profile Has Been Updated Successfully!";
        state.sessionExpired = false;
        state.info = {
          ...state.info,
          email: action.payload.email,
        };
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.sessionExpired = false;
      });
  },
});

export const { resetAdminAuthStatus } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
