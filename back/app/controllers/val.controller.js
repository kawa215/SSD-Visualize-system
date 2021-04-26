const db = require("../models");
const Val = db.vals;

// Retrieve all Vals from the database.
exports.findAll = (req, res) => {
  console.log("find all");
  var field = { name: 1, attributes: 1, _id: 0 };
  var numofsheets = 21;
  // limit で数を制限
  Val.find({}, field)
    .limit(numofsheets)
    .then((data) => {
      res.send(data);
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vals.",
      });
    });
};

// Retrieve Vals from the database.
exports.findVals = (req, res) => {
  console.log("find vals");
  console.log(req.query.weathers);

  var condition = {
    "attributes.weather": { $in: req.query.weathers },
    "attributes.scene": { $in: req.query.scenes },
    "attributes.timeofday": { $in: req.query.timeofdays },
  };

  var field = { name: 1, attributwes: 1, _id: 0 };
  var numofsheets = 21;
  // // limit で数を制限
  Val.find(condition, field)
    .limit(numofsheets)
    .then((data) => {
      res.send(data);
      console.log("data:" + data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vals.",
      });
    });
};

// // Find a single Val with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   Val.findById(id)
//     .then((data) => {
//       if (!data)
//         res.status(404).send({ message: "Not found Val with id " + id });
//       else res.send(data);
//     })
//     .catch((err) => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving Val with id=" + id });
//     });
// };

// // Update a Val by the id in the request
// exports.update = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!",
//     });
//   }

//   const id = req.params.id;

//   Val.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//     .then((data) => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot update Val with id=${id}. Maybe Val was not found!`,
//         });
//       } else res.send({ message: "Val was updated successfully." });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error updating Val with id=" + id,
//       });
//     });
// };

// // Delete a Val with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Val.findByIdAndRemove(id)
//     .then((data) => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot delete Val with id=${id}. Maybe Val was not found!`,
//         });
//       } else {
//         res.send({
//           message: "Val was deleted successfully!",
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Could not delete Val with id=" + id,
//       });
//     });
// };

// // Delete all Vals from the database.
// exports.deleteAll = (req, res) => {
//   Val.deleteMany({})
//     .then((data) => {
//       res.send({
//         message: `${data.deletedCount} Vals were deleted successfully!`,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all vals.",
//       });
//     });
// };

// // Find all published Vals
// exports.findAllPublished = (req, res) => {
//   Val.find({ published: true })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving vals.",
//       });
//     });
// };
