import { createStore } from "redux";

// stateの管理
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

// モデル変更
export const changeModel = (model) => ({
  type: "CHNGE_MODEL",
  model: model,
});

//　対象画像変更
export const changeImage = (name, weather, scene, timeofday) => ({
  type: "CHANGE_IMAGE",
  name: name,
  weather: weather,
  scene: scene,
  timeofday: timeofday,
});

// 比較ビューに追加
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

//　要因マップ画像削除
export const deleteFactorImage = (targetIndex, factorIndex) => ({
  type: "DELETE_FACTOR_IMAGE",
  targetIndex: targetIndex,
  factorIndex: factorIndex,
});

// attributes 条件変更
export const changeConditions = (attributes) => ({
  type: "CHANGE_CONDITION",
  weather: attributes.weather,
  scene: attributes.scene,
  timeofday: attributes.timeofday,
});

// reducer定義
const reducer = (state = initialState, action) => {
  var cloneTargets;
  var cloneFactorImages;

  switch (action.type) {
    case "ADD_IMAGES":
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
      var index = state.target_images.findIndex(
        ({ name, model }) => name === action.image && model === state.model
      );
      cloneFactorImages = JSON.parse(JSON.stringify(state.factor_images));
      var newImages;
      if (index < 0) {
        //対象画像重複なし
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
        cloneFactorImages[state.target_images.length]=visualizedImage;
        newImages = JSON.parse(JSON.stringify(cloneFactorImages));
        if (action.detect === "all") {
          cloneFactorImages[state.target_images.length]=null;
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
        if (action.detect === "all") {
          return {
            ...state,
          };
        } else {
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
            cloneFactorImages[index]=visualizedImage;
            newImages = JSON.parse(JSON.stringify(cloneFactorImages));
            return {
              ...state,
              factor_images: newImages,
            };
          }
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
      return {
        ...state,
        image: action.name,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
      };
    case "CHANGE_CONDITION":
      return {
        ...state,
        weather: action.weather,
        scene: action.scene,
        timeofday: action.timeofday,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
