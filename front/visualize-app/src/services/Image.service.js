import { userApi, boxApi } from "../http-common";

class ImageDataService {
  getAll() {
    return userApi.get("/vals");
  }

  // getBoxImage() {}

  getBoxList(imageName) {
    return boxApi.get(`/${imageName}`);
  }

  getDetectBoxList(boxList, imageName) {
    console.log(boxList);
    // return boxApi.get(`/detect/detectBoxes/${boxList}`);
    return boxApi.get("/detect/detectBoxes", {
      params: { boxList: boxList, imageName: imageName },
    });
  }

  getBoxImage(box, imageName) {
    console.log(box);
    // return boxApi.get(`/detect/detectBoxes/${boxList}`);
    return boxApi.get("/detect/boxImage", {
      params: { box: box, imageName: imageName },
    });
  }

  getVals(weathers, scenes, timeofdays) {
    console.log("getvals:");
    console.log(weathers);

    return userApi.get("/vals/conditions", {
      params: { weathers: weathers, scenes: scenes, timeofdays: timeofdays },
    });
  }

  get(id) {
    return userApi.get(`/vals/${id}`);
  }

  getConditionByName(name) {
    return userApi.get(`/vals/${name}`);
  }

  // create(data) {
  //   return http.post("/vals", data);
  // }

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
