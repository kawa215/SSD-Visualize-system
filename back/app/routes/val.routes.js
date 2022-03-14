module.exports = (app) => {
  const vals = require("../controllers/val.controller.js");

  var router = require("express").Router();

  //image from BDD100K 検証用データセット( /image/val)

  router.get("/", vals.findAll);

  router.get("/conditions", vals.findVals);

  router.get("/one/:name", vals.findOneCondition);

  router.get("/images", vals.findConditions);

  router.post("/images", vals.postfindConditions);

  app.use("/api/vals", router);
};
