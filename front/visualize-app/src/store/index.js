import { createStore } from "redux";

// export const deleteName = () => ({
//   type: "DELETE_NAME",
//   name: "",
// });
const initialState = {
  count: 2,
  radio: "",
  image: "",
  weather: "",
  scene: "",
  timeofday: "",
  images: [],
};

// 引数nameをとり、{type: "ADD_NAME", name: name}を返すjsの関数。
export const changeCount = () => ({
  type: "CHNGE_COUNT",
});

export const changeImage = (name) => ({
  type: "CHANGE_IMAGE",
  name: name,
});

export const addImages = (name) => ({
  type: "ADD_IMAGES",
  name: name,
});

export const changeConditions = (attributes) => ({
  type: "CHANGE_CONDITION",
  weather: attributes.weather,
  scene: attributes.scene,
  timeofday: attributes.timeofday,
});

const reducer = (state = initialState, action) => {
  console.log(action.type);

  switch (action.type) {
    // case "INCREASE_COUNT":
    //   return {
    //     count: state.count + 1,
    //   };
    case "ADD_IMAGES":
      return {
        ...state,
        images: [...state.images, action.name],
      };
    case "CHNGE_COUNT":
      return {
        ...state,
        count: state.count + 1,
      };
    case "CHANGE_IMAGE":
      return {
        ...state,
        image: action.name,
      };
    case "CHANGE_CONDITION":
      console.log("readuceきた");
      console.log(action.weather);
      return {
        ...state,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
      };
    // case "DECREASE_COUNT":
    //   return {
    //     count: state.count - 1,
    //   };
    // case "ADD_IMAGE":
    //   return {
    //     image: state.payload,
    //   };
    // case "CHANGE_RADIO":
    //   return {
    //     radio: state.radio,
    //   };
    // case "CHANGE_WEATHERS":
    //   return [...action.payload];
    // case "CHANGE_SCENES":
    //   return [...action.payload];
    // case "CHANGE_TIMEOFDAYS":
    //   return [...action.payload];

    // case "COUNT_UP":
    //   return {
    //     clickCount: state.clickCount + 1,
    //     currentValue: state.currentValue + action.value,
    //   };
    // case "COUNT_DOWN":
    //   return {
    //     clickCount: state.clickCount + 1,
    //     currentValue: state.currentValue - action.value,
    //   };
    default:
      return state;
  }
};
//storeにcountを保持
const store = createStore(reducer);

export default store;
