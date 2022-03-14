var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
const path = require("path");
const fs = require("fs");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/vals", express.static("val"));
app.use("/viss", express.static("vis"));
app.use("/box", express.static("heatmaps.q1000.20220103"));

// ディレクトリ配下にあるファイルを再帰的に探索する
const searchFiles = (dirPath, searchFileName, i) => {
  var allDirents;
  try {
    allDirents = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    return;
  }

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);

      files.push(searchFiles(fp, searchFileName, i));
    } else if (
      dirent.isFile() &&
      path.basename(dirent.name).includes(searchFileName)
    ) {
      files.push({
        dir: path.join(dirPath, dirent.name),
        name: dirent.name,
      });
    }
  }

  files.flat();
  if (i == 1) {
    return files[0];
  } else {
    return files;
  }
};

// HTTPリクエストを受け取る部分
app.get("/", function (req, res) {
  res.send("Hello World!");
});

// 画像名　モデルを指定 全てのボックスが写った検出画像を取得
app.get("/imageName", function (req, res) {
  const imageName = req.query.imageName;
  const model = req.query.model;

  let ret = imageName.replace(".jpg", "");
  const dirPath = "heatmaps.q1000.20220103/" + ret + "/" + model;

  // 直下のファイルやディレクトリ全てがDirentオブジェクトの配列で返ってくる
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const fileNames = allDirents
    .filter((dirent) => !dirent.isFile())
    .map(({ name }) => name);

  fileNames.unshift("all");
  res.send(fileNames);
});

// HTTPリクエストを受け取る部分
app.get("/", function (req, res) {
  res.send("Hello World!");
});

// 選択された可視化手法に対してクラスの一覧を取得する
app.get("/boxVisualization/classList", function (req, res) {
  const model = req.query.model;
  const imageName = req.query.imageName;
  const box = req.query.box;
  const method = req.query.method;

  let ret = imageName.replace(".jpg", "");
  const dirPath = "heatmaps.q1000.20220103/" + ret + "/" + model + "/" + box;
  var arrayOfClass = null;

  if (method) {
    var targetClassArray = searchFiles(dirPath, method, 0);
    if (targetClassArray !== undefined) {
      arrayOfClass = targetClassArray.map((targetClass) => {
        var pattern = /[\_]/;
        var splitArray = targetClass.name.split(pattern);
        return splitArray[splitArray.length - 1].replace(".png", "");
      });
    }
  }
  res.send(arrayOfClass);
});

// 画像名　モデルを指定　それぞれの検出パターンの枚数を取得
app.get("/getPerformanceScore", function (req, res) {
  const model = req.query.model;
  const imageName = req.query.imageName;

  let ret = imageName.replace(".jpg", "");
  const dirPath = "heatmaps.q1000.20220103/" + ret + "/" + model;

  var arrayOfScore = [];
  var sortOfDetect;
  for (var i = 0; i < 3; i++) {
    switch (i) {
      case 0:
        sortOfDetect = "correct";
        break;
      case 1:
        sortOfDetect = "misdetect";
        break;
      case 2:
        sortOfDetect = "misclass";
        break;
      default:
    }
    arrayOfScore[i] = searchFiles(dirPath, sortOfDetect, 0)
      .flat()
      .filter(Boolean).length;
  }
  res.send(arrayOfScore);
});

// モデル 検出パターンを指定 画像　を取得
app.get("/detect/sortofdetect", function (req, res) {
  const sortOfDetect = req.query.sortOfDetect;
  const model = req.query.model;
  if (!model) return;

  var arrayImageDetect = [];
  var dirPath = "heatmaps.q1000.20220103";

  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });
  const directoryImageNames = allDirents.filter((dirent) => !dirent.isFile());
  dirPath = "./" + dirPath;
  var detectImageArray = [];

  if (sortOfDetect !== "all") {
    for (var i = 0; i < directoryImageNames.length; i++) {
      dirPath = dirPath + "/" + directoryImageNames[i].name + "/" + model;
      if (searchFiles(dirPath, sortOfDetect + ".png", 1) !== undefined) {
        detectImageArray.push(directoryImageNames[i]);
      }
      dirPath = "./heatmaps.q1000.20220103";
    }
    res.send(detectImageArray);
  } else {
    res.send(directoryImageNames);
  }
});

// 画像リスト　モデル 検出パターンを指定 画像を取得
app.post("/detect/SelectedImage/sortofdetect", function (req, res) {
  const sortOfDetect = req.body.params.sortOfDetect;
  const model = req.body.params.model;
  const imageList = req.body.params.imageList;

  var arrayImageDetect = [];
  var dirPath = "heatmaps.q1000.20220103";

  const directoryImageNames = imageList.map((image) => {
    return image.replace(".jpg", "");
  });
  var detectImageArray = [];

  for (var i = 0; i < directoryImageNames.length; i++) {
    dirPath = dirPath + "/" + directoryImageNames[i] + "/" + model;
    if (searchFiles(dirPath, sortOfDetect + ".png", 1) !== undefined) {
      detectImageArray.push(directoryImageNames[i]);
    }
    dirPath = "./heatmaps.q1000.20220103";
  }
  res.send(detectImageArray);
});

// 画像名 モデル ボックスリスト を指定　クラス確信度などを取得
app.get("/detect/detectBoxes", function (req, res) {
  const fileNames = req.query.boxList;
  const imageName = req.query.imageName;
  const model = req.query.model;

  let ret = imageName.replace(".jpg", "");
  const dirPath = "heatmaps.q1000.20220103/" + ret + "/" + model;

  const arrayDetectAns = fileNames.map((fileName) => {
    const detectPath = dirPath + "/" + fileName;
    const alldetectDirents = fs.readdirSync(detectPath, {
      withFileTypes: true,
    });
    const fileDetectNames = alldetectDirents.map(({ name }) => name);
    return fileDetectNames[fileDetectNames.length - 1];
  });

  const arrayDetectBox = arrayDetectAns.map((detectBoxImageName) => {
    var pattern = /[\_]/;
    return detectBoxImageName.split(pattern);
  });

  res.send(arrayDetectBox);
});

// 画像名 モデル ボックス を指定 指定したボックスのみが写っている検出画像を取得
app.get("/detect/boxImage", function (req, res) {
  const box = req.query.box;
  const imageName = req.query.imageName;
  const model = req.query.model;

  let ret = imageName.replace(".jpg", "");
  const dirPath = "heatmaps.q1000.20220103/" + ret + "/" + model;
  const detectPath = dirPath + "/" + box;

  const alldetectDirents = fs.readdirSync(detectPath, {
    withFileTypes: true,
  });
  const fileDetectNames = alldetectDirents.map(({ name }) => name);
  res.send(fileDetectNames[fileDetectNames.length - 1]);
});

// サーバーを起動する部分
var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
