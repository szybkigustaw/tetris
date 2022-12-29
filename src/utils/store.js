import { createStore } from "redux";
import reducer from "./reducer";

let initialState = [];

const store = createStore(reducer, initialState);

store.subscribe(() => {
    console.log("store", store);
    console.log("store state", store.getState());
});

export default store;

