module.exports = (app) => {
  const vals = require("../controllers/val.controller.js");

  var router = require("express").Router();

  // // Create a new val
  // router.post("/", vals.create);

  // Retrieve all vals
  router.get("/", vals.findAll);

  // router.get("/:imageName", vals.findBoxList);

  // Retrieve vals on conditions
  router.get("/conditions", vals.findVals);

  // // Retrieve all published vals
  // router.get("/published", vals.findAllPublished);

  // // Retrieve a single val with name
  router.get("/one/:name", vals.findOneCondition);

  router.get("/images", vals.findConditions);

  router.post("/images", vals.postfindConditions);
  // // Update a val with id
  // router.put("/:id", vals.update);

  // // Delete a val with id
  // router.delete("/:id", vals.delete);

  // // Create a new val
  // router.delete("/", vals.deleteAll);

  app.use("/api/vals", router);
};
