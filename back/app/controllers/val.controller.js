const db = require("../models");
const Val = db.vals;

// // Create and Save a new Val
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.title) {
//     res.status(400).send({ message: "Content can not be empty!" });
//     return;
//   }

//   // Create a Val
//   const val = new Val({
//     title: req.body.title,
//     description: req.body.description,
//     published: req.body.published ? req.body.published : false,
//   });

//   // Save Val in the database
//   val
//     .save(val)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Val.",
//       });
//     });
// };

// Retrieve all Vals from the database.
exports.findAll = (req, res) => {
  console.log("find all");
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  console.log("condition:" + condition);
  // var condition = { name: "b1c66a42-6f7d68ca.jpg" };
  // limit で数を制限
  Val.find(condition).limit(1)
    .then((data) => {
      res.send(data);
      console.log("data:" + data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vals.",
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
