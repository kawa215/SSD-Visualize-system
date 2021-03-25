import http from "../http-common";

class ImageDataService {
  getAll() {
    return http.get("/vals");
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