module.exports = (app) => {
  const vals = require("../controllers/val.controller.js");

  var router = require("express").Router();

  // // Create a new Tutorial
  // router.post("/", vals.create);

  // Retrieve all Tutorials
  router.get("/", vals.findAll);

  // // Retrieve all published Tutorials
  // router.get("/published", vals.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get("/:id", vals.findOne);

  // // Update a Tutorial with id
  // router.put("/:id", vals.update);

  // // Delete a Tutorial with id
  // router.delete("/:id", vals.delete);

  // // Create a new Tutorial
  // router.delete("/", vals.deleteAll);

  app.use("/api/vals", router);
};
