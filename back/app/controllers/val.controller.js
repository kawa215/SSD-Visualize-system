const db = require("../models");
const Val = db.vals;

// 検証用valデータセット 100枚 取得
exports.findAll = (req, res) => {
  var field = { name: 1, attributes: 1, _id: 0 };
  var numofsheets = 100;
  // limit で数を制限
  Val.find({}, field)
    .limit(numofsheets)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vals.",
      });
    });
};

// attributes条件で画像を検索 取得
exports.findVals = (req, res) => {
  var condition;
  if (req.query.weathers) {
    if (req.query.scenes) {
      if (req.query.timeofdays) {
        condition = {
          "attributes.weather": { $in: req.query.weathers },
          "attributes.scene": { $in: req.query.scenes },
          "attributes.timeofday": { $in: req.query.timeofdays },
        };
      } else {
        condition = {
          "attributes.weather": { $in: req.query.weathers },
          "attributes.scene": { $in: req.query.scenes },
        };
      }
    } else {
      if (req.query.timeofdays) {
        condition = {
          "attributes.weather": { $in: req.query.weathers },
          "attributes.timeofday": { $in: req.query.timeofdays },
        };
      } else {
        condition = {
          "attributes.weather": { $in: req.query.weathers },
        };
      }
    }
  } else {
    if (req.query.scenes) {
      if (req.query.timeofdays) {
        condition = {
          "attributes.scene": { $in: req.query.scenes },
          "attributes.timeofday": { $in: req.query.timeofdays },
        };
      } else {
        condition = {
          "attributes.scene": { $in: req.query.scenes },
        };
      }
    } else {
      if (req.query.timeofdays) {
        condition = {
          "attributes.timeofday": { $in: req.query.timeofdays },
        };
      } else {
        condition = {};
      }
    }
  }

  var field = { name: 1, attributes: 1, _id: 0 };
  var numofsheets = 21;
  Val.find(condition, field)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vals.",
      });
    });
};

// 画像名を指定 attributesを取得
exports.findOneCondition = (req, res) => {
  const condition = {
    name: req.params.name,
  };
  const field = { attributes: 1, _id: 0 };

  Val.find(condition, field)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Val with id " + id });
      else res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Val with id=" + id });
    });
};

// 画像名を指定　画像名とattributesを取得
exports.findConditions = (req, res) => {
  const condition = {
    name: { $in: req.query.imagesName },
  };
  const field = { name: 1, attributes: 1, _id: 0 };

  Val.find(condition, field)
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found" });
      else res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Val" });
    });
};

// 画像名を指定 画像名とattributesを取得
exports.postfindConditions = (req, res) => {
  const condition = {
    name: { $in: req.body },
  };
  const field = { name: 1, attributes: 1, _id: 0 };

  Val.find(condition, field)
    .then((data) => {
      if (!data) res.status(404).send({ message: "Not found" });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Val" });
    });
};
