import { createStore } from "redux";

const initialState = {
  count: 0,
  radio: "",
  image: "",
  weathers: [],
  scenes: [],
  timeofdays: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREASE_COUNT":
      return {
        count: state.count + 1,
      };
    case "DECREASE_COUNT":
      return {
        count: state.count - 1,
      };
    case "ADD_IMAGE":
      return {
        image: state.payload,
      };
    case "CHANGE_RADIO":
      return {
        radio: state.radio,
      };
    case "CHANGE_WEATHERS":
      return [...action.payload];
    case "CHANGE_SCENES":
      return [...action.payload];
    case "CHANGE_TIMEOFDAYS":
      return [...action.payload];
    default:
      return state;
  }
};
//storeにcountを保持
const store = createStore(reducer);

export default store;
