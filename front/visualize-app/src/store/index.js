// import { model } from "mongoose";
import { createStore } from "redux";

// export const deleteName = () => ({
//   type: "DELETE_NAME",
//   name: "",
// });
const initialState = {
  count: 2,
  radio: "",
  model: "",
  image: "",
  weather: "",
  scene: "",
  timeofday: "",
  target_images: [],
  factor_images: [],
};

// 引数nameをとり、{type: "ADD_NAME", name: name}を返すjsの関数。
export const changeModel = (model) => ({
  type: "CHNGE_MODEL",
  model: model,
});

export const changeImage = (name, weather, scene, timeofday) => ({
  type: "CHANGE_IMAGE",
  name: name,
  weather: weather,
  scene: scene,
  timeofday: timeofday,
});

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
  clas,
  pose,
  opacity,
  scale,
  style,
  score
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
  pose,
  opacity,
  scale,
  style,
  score,
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
      console.log(action);
      cloneTargets = [...state.target_images];
      const targetImage = {
        model: state.model,
        name: action.image,
        boxImageURL: action.boxImageURL,
        detectAllURL:
          "http://localhost:4000/box/" +
          state.image.replace(".jpg", "") +
          "/" +
          state.model +
          "/" +
          state.image.replace(".jpg", "") +
          "_" +
          state.model +
          "_detect_all.png",
        box: action.box,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
        grImageURL:
          "http://localhost:4000/box/" +
          state.image.replace(".jpg", "") +
          "/" +
          state.image.replace(".jpg", "") +
          "_gt.png",
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
        pose: action.pose,
        opacity: action.opacity,
        scale: action.scale,
        style: action.style,
        score: action.score,
      };
      console.log(visualizedImage);
      //中身コピー
      var index = state.target_images.findIndex(
        ({ name, model }) => name === action.image && model === state.model
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
        console.log("重複なし");
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
            pose: action.pose,
            opacity: action.opacity,
            scale: action.scale,
            style: action.style,
            score: action.score,
          },
        ];
        console.log(state.factor_images)
        cloneFactorImages[state.target_images.length]=visualizedImage;
        // cloneFactorImages.push(visualizedImage);
        newImages = JSON.parse(JSON.stringify(cloneFactorImages));
        console.log(cloneFactorImages)
        if (action.detect === "all") {
          console.log(state.factor_images)
          cloneFactorImages[state.target_images.length]=null;
          // cloneFactorImages.push(visualizedImage);
          newImages = JSON.parse(JSON.stringify(cloneFactorImages));
          return {
            ...state,
            target_images: [...state.target_images, targetImage],
            factor_images: newImages,
          };
        } else {
          return {
            ...state,
            target_images: [...state.target_images, targetImage],
            factor_images: newImages,
          };
        }
      } else {
        //対象画像重複あり
        console.log("重複あり");
        // if (state.target_images[index].model === state.model) {
        // } else {
        // }

        if (action.detect === "all") {
          return {
            ...state,
          };
        } else {
          // if(state.target_images[index].detect === "all" &&)
          if (!cloneFactorImages[index]) {
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
                pose: action.pose,
                opacity: action.opacity,
                scale: action.scale,
                style: action.style,
                score: action.score,
              },
            ];
            // cloneFactorImages.push(visualizedImage);
            cloneFactorImages[index]=visualizedImage;
            console.log(cloneFactorImages)

            newImages = JSON.parse(JSON.stringify(cloneFactorImages));
            // if (action.detect === "all") {
            //   return {
            //     ...state,
            //     target_images: [...state.target_images, targetImage],
            //   };
            // } else {
            return {
              ...state,
              // target_images: [...state.target_images, targetImage],
              factor_images: newImages,
            };
            // }
          }

          //ここは配列ある前提
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
        // return {
        //   ...state,
        //   factor_images: newImages,
        // };
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
    case "CHNGE_MODEL":
      return {
        ...state,
        model: action.model,
      };
    case "CHANGE_IMAGE":
      console.log("CHANGE_IMAGE");
      console.log(action);
      return {
        ...state,
        image: action.name,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
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
