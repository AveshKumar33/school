import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import encryptionTransformer from "./cryptoJs";
import authReducer from "./auth-slice";
import passwordReducer from "./password-slice";
import uiReducer from "./ui-slice";
import httpReducer from "./http-slice";
import assignmentReducer from "./assignment-slice";

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptionTransformer],
  whitelist: ["auth"],
  onRehydrate: () => {
    localStorage.removeItem("persist:root");
    PURGE();
  },
};

const reducers = combineReducers({
  auth: authReducer,
  passwordChange: passwordReducer,
  ui: uiReducer,
  assignment: assignmentReducer,
  httpRequest: httpReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// const store = configureStore({
//   reducer: { auth: authReducer },
// });

const persistor = persistStore(store);

export { store, persistor };
