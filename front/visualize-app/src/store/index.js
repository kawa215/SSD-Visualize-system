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
  target_images: [],
  factor_images: [],
};

// 引数nameをとり、{type: "ADD_NAME", name: name}を返すjsの関数。
export const changeCount = () => ({
  type: "CHNGE_COUNT",
});

export const changeImage = (name) => ({
  type: "CHANGE_IMAGE",
  name: name,
});

// export const addTargetImage = (image, weather, scene, timeofday) => ({
//   type: "ADD_TARGET_IMAGES",
//   image: image,
//   weather: weather,
//   scene: scene,
//   timeofday: timeofday,
// });

export const addImages = (
  image,
  weather,
  scene,
  timeofday,
  boxImageURL,
  box,
  visualizedImageURL,
  detect,
  method,
  clas
) => ({
  type: "ADD_IMAGES",
  image: image,
  weather: weather,
  scene: scene,
  timeofday: timeofday,
  boxImageURL: boxImageURL,
  box: box,
  visualizedImageURL: visualizedImageURL,
  detect: detect,
  method: method,
  clas: clas,
});

export const deleteFactorImage = (targetIndex, factorIndex) => ({
  type: "DELETE_FACTOR_IMAGE",
  targetIndex: targetIndex,
  factorIndex: factorIndex,
});

export const changeConditions = (attributes) => ({
  type: "CHANGE_CONDITION",
  weather: attributes.weather,
  scene: attributes.scene,
  timeofday: attributes.timeofday,
});

const reducer = (state = initialState, action) => {
  console.log(action.type);
  var cloneTargets;
  var cloneFactorImages;

  switch (action.type) {
    case "ADD_IMAGES":
      //重複チェック
      // Array.from(new Set(array1));
      console.log("ADD_IMAGES");
      console.log(action)
      cloneTargets = [...state.target_images];
      const targetImage = {
        name: action.image,
        boxImageURL: action.boxImageURL,
        box: action.box,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
      };
      var visualizedImage = {
        name: action.image,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
        boxImageURL: action.boxImageURL,
        box: action.box,
        visualizedImageURL: action.visualizedImageURL,
        detect: action.detect,
        method: action.method,
        clas: action.clas,
      };
      console.log(visualizedImage);
      //中身コピー
      var index = state.target_images.findIndex(
        ({ name }) => name === action.image
      );
      // var index = state.target_images.indexOf(action.image);
      cloneFactorImages = JSON.parse(JSON.stringify(state.factor_images));
      console.log(state.factor_images);
      console.log(cloneFactorImages);
      var newImages;
      //対象画像重複なしindex見つからない
      console.log(index);
      if (index < 0) {
        //可視化画像ストックあり
        //多次元コピー
        visualizedImage = [
          {
            name: action.image,
            weather: action.weather,
            scene: action.scene,
            timeofday: action.timeofday,
            boxImageURL: action.boxImageURL,
            box: action.box,
            visualizedImageURL: action.visualizedImageURL,
            detect: action.detect,
            method: action.method,
            clas: action.clas,
          },
        ];
        cloneFactorImages.push(visualizedImage);
        newImages = JSON.parse(JSON.stringify(cloneFactorImages));
        return {
          ...state,
          target_images: [...state.target_images, targetImage],
          factor_images: newImages,
        };
      } else {
        //対象画像重複あり
        console.log("重複あり");

        if (cloneFactorImages[index].length > 3) {
          return {
            ...state,
          };
        }
        cloneFactorImages[index].push(visualizedImage);
        newImages = JSON.parse(JSON.stringify(cloneFactorImages));
        return {
          ...state,
          factor_images: newImages,
        };
      }
    case "DELETE_FACTOR_IMAGE":
      cloneTargets = [...state.target_images];
      cloneFactorImages = JSON.parse(JSON.stringify(state.factor_images));

      if (action.factorIndex === -1) {
        cloneTargets.splice(action.targetIndex, 1);
        cloneFactorImages.splice(action.targetIndex, 1);
        return {
          ...state,
          target_images: cloneTargets,
          factor_images: cloneFactorImages,
        };
      } else {
        cloneFactorImages[action.targetIndex].splice(action.factorIndex, 1);
        return {
          ...state,
          factor_images: cloneFactorImages,
        };
      }
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
