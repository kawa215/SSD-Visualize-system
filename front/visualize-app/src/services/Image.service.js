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
    return boxApi.get("/detect/sortofdetect", {
      params: { model: model, sortOfDetect: sortOfDetect },
    });
  }

  getDetectSelectedImageList(model, sortOfDetect, imageList) {
    return boxApi.post("/detect/SelectedImage/sortofdetect", {
      params: {
        model: model,
        sortOfDetect: sortOfDetect,
        imageList: imageList,
      },
    });
  }

  getDetectBoxList(boxList, imageName, model) {
    return boxApi.get("/detect/detectBoxes", {
      params: { boxList: boxList, imageName: imageName, model: model },
    });
  }

  getBoxImage(box, imageName, model) {
    return boxApi.get("/detect/boxImage", {
      params: { box: box, imageName: imageName, model: model },
    });
  }

  getVals(weathers, scenes, timeofdays) {
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
    return databaseApi.get("/vals/images", {
      params: { imagesName: imagesName },
    });
  }

  postgetConditionByImagesName(imagesName) {
    return databaseApi.post("/vals/images", imagesName);
  }
}

export default new ImageDataService();
