/*
    Store - kontener dla stanów Redux. Przewidywalny, prosty w obsłudze i niezawodny :3
*/
import { createStore } from "redux";
import reducer from "./reducer";

let initialState = [];

const store = createStore(reducer, initialState);

//Wyświetl informacje pomocniczne w konsoli po zasubskrybowaniu się do sklepu 
//(tj. podłączeniu i wykonaniu na nim operacji)
store.subscribe(() => {
    console.log("store", store);
    console.log("store state", store.getState());
});

export default store;

