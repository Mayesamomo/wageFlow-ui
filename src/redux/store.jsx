import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import {clientReducer} from "./reducers/client";

const Store = configureStore({
    reducer: {
      user: userReducer,
      client: clientReducer,
    },
  });
  
  export default Store;