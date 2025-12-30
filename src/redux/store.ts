import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import campaignReducer from "./slices/campaignSlice";
import filterReducer from "./slices/filterSlice";
import dashboardReducer from "./slices/dashboardSlice";
import templateReducer from "./slices/templateSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,    
    campaign: campaignReducer, 
    filter: filterReducer,
    dashboard: dashboardReducer,
    template: templateReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
