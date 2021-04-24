import http from "../http-common";

class ImageDataService {
  getAll() {
    return http.get("/vals");
  }
  getVals(weathers, scenes, timeofdays) {
    console.log("getvals:");
    console.log(weathers);

    return http.get("/vals/conditions", {
      params: { weathers: weathers, scenes: scenes, timeofdays: timeofdays },
    });
  }

  get(id) {
    return http.get(`/vals/${id}`);
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
