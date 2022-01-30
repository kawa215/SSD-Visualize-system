// import { model } from "mongoose";
import { databaseApi, boxApi } from "../http-common";

class ImageDataService {
  getAll() {
    return databaseApi.get("/vals");
  }

  getPerformanceScore(imageName,model) {
    return boxApi.get("/getPerformanceScore", {
      params: { imageName: imageName, model: model },
    });
  }

  // getBoxImage() {}

  getBoxList(imageName, model) {
    return boxApi.get("/imageName", {
      params: { imageName: imageName, model: model },
    });
  }

  getClassList(model, imageName, box, method) {
    return boxApi.get("/boxVisualization/classList", {
      params: { model: model, imageName: imageName, box: box, method: method },
    });
  }

  getALLdetectImageList(model, sortOfDetect) {
    console.log(sortOfDetect);
    return boxApi.get("/detect/sortofdetect", {
      params: { model: model, sortOfDetect: sortOfDetect },
    });
  }

  getDetectSelectedImageList(model, sortOfDetect, imageList) {
    console.log("getDetectSelectedImageList");
    return boxApi.post("/detect/SelectedImage/sortofdetect", {
      params: {
        model: model,
        sortOfDetect: sortOfDetect,
        imageList: imageList,
      },
    });
  }

  getDetectBoxList(boxList, imageName, model) {
    console.log(boxList);
    // return boxApi.get(`/detect/detectBoxes/${boxList}`);
    return boxApi.get("/detect/detectBoxes", {
      params: { boxList: boxList, imageName: imageName, model: model },
    });
  }

  getBoxImage(box, imageName, model) {
    console.log(box);
    // return boxApi.get(`/detect/detectBoxes/${boxList}`);
    return boxApi.get("/detect/boxImage", {
      params: { box: box, imageName: imageName, model: model },
    });
  }

  getVals(weathers, scenes, timeofdays) {
    console.log("getvals:");
    console.log(weathers);

    return databaseApi.get("/vals/conditions", {
      params: { weathers: weathers, scenes: scenes, timeofdays: timeofdays },
    });
  }

  get(id) {
    return databaseApi.get(`/vals/${id}`);
  }

  getConditionByName(name) {
    return databaseApi.get(`/vals/${name}`);
  }

  getConditionByImagesName(imagesName) {
    console.log("getConditionByImagesName");
    console.log(imagesName);
    return databaseApi.get("/vals/images", {
      params: { imagesName: imagesName },
    });
  }

  postgetConditionByImagesName(imagesName) {
    return databaseApi.post("/vals/images", imagesName);
  }

  // update(id, data) {
  //   return http.put(`/vals/${id}`, data);
  // }

  // delete(id) {
  //   return http.delete(`/vals/${id}`);
  // }

  // deleteAll() {
  //   return http.delete(`/vals`);
  // }

  // findByTitle(title) {
  //   return http.get(`/vals?title=${title}`);
  // }
}

export default new ImageDataService();
