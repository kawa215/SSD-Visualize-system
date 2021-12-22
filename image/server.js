var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
const path = require("path");
const fs = require("fs");
const { dir } = require("console");

app.use(cors());

//多分層が深くあんったmodel分だからリストにmomdel出てる

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" })); // jsonをパースする際のlimitを設定
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // urlencodeされたボディをパースする際のlimitを設定
app.use("/vals", express.static("val"));

app.use("/viss", express.static("vis"));

app.use("/box", express.static("heatmaps.q1000.20211215"));

const searchFiles = (dirPath, searchFileName) => {
  var allDirents;
  try {
    allDirents = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    // console.log(err);
    return;
  }

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);

      files.push(searchFiles(fp, searchFileName));
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
  return files[0];
};

// HTTPリクエストを受け取る部分
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/imageName", function (req, res) {
  console.log("-----------");
  const imageName = req.query.imageName;
  const model = req.query.model;

  let ret = imageName.replace(".jpg", "");

  const dirPath = "heatmaps.q1000.20211215/" + ret + "/" + model;

  console.log("imageNameきた！");
  console.log(dirPath);

  // "path/to/target" 直下のファイルやディレクトリ全てがDirentオブジェクトの配列で返ってくる
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const fileNames = allDirents
    .filter((dirent) => !dirent.isFile())
    .map(({ name }) => name);

  console.log("-----------");
  fileNames.unshift("all");
  res.send(fileNames);
});

app.get("/detect/sortofdetect", function (req, res) {
  console.log("--/detect/detectBoxes/:sortOfDetect--");
  const sortOfDetect = req.query.sortOfDetect;
  const model = req.query.model;
  console.log(sortOfDetect);
  console.log(model);
  if (!model) return;
  //画像を引っ張り出す[画像名(正検出)]
  var arrayImageDetect = [];
  //　画像名

  //画像名一覧
  var dirPath = "heatmaps.q1000.20211215";
  // "path/to/target" 直下のファイルやディレクトリ全てがDirentオブジェクトの配列で返ってくる
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });
  const directoryImageNames = allDirents.filter((dirent) => !dirent.isFile());
  dirPath = "./" + dirPath;
  var detectImageArray = [];
  // console.log(dirPath);
  // console.log(directoryImageNames);
  if (sortOfDetect !== "all") {
    for (var i = 0; i < directoryImageNames.length; i++) {
      dirPath = dirPath + "/" + directoryImageNames[i].name + "/" + model;
      // console.log(i)
      // console.log(dirPath)
      // console.log(dirPath)
      // console.log(sortOfDetect)
      if (searchFiles(dirPath, sortOfDetect + ".png") !== undefined) {
        detectImageArray.push(directoryImageNames[i]);
      }
      dirPath = "./heatmaps.q1000.20211215";
    }
    res.send(detectImageArray);
  } else {
    res.send(directoryImageNames);
  }

  // console.log(detectImageArray);
});

app.post("/detect/SelectedImage/sortofdetect", function (req, res) {
  console.log("--/detect/SelectedImage/sortofdetect--");
  // console.log(req.body);
  const sortOfDetect = req.body.params.sortOfDetect;
  const model = req.body.params.model;
  const imageList = req.body.params.imageList;
  // console.log(sortOfDetect);
  //画像を引っ張り出す[画像名(正検出)]
  var arrayImageDetect = [];
  //　画像名

  //画像名一覧
  var dirPath = "heatmaps.q1000.20211215";
  // "path/to/target" 直下のファイルやディレクトリ全てがDirentオブジェクトの配列で返ってくる
  // const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });
  // const directoryImageNames = allDirents.filter((dirent) => !dirent.isFile());
  // dirPath = "./" + dirPath;
  const directoryImageNames = imageList.map((image) => {
    return image.replace(".jpg", "");
  });
  var detectImageArray = [];
  console.log(directoryImageNames);
  for (var i = 0; i < directoryImageNames.length; i++) {
    dirPath = dirPath + "/" + directoryImageNames[i] + "/" + model;
    if (searchFiles(dirPath, sortOfDetect + ".png") !== undefined) {
      detectImageArray.push(directoryImageNames[i]);
    }
    dirPath = "./heatmaps.q1000.20211215";
  }
  res.send(detectImageArray);
});

//boxの番号
app.get("/detect/detectBoxes", function (req, res) {
  console.log("---/detect/detectBoxes--------");

  const fileNames = req.query.boxList;
  const imageName = req.query.imageName;
  const model = req.query.model;
  console.log("detextboxesきた！");

  let ret = imageName.replace(".jpg", "");

  const dirPath = "heatmaps.q1000.20211215/" + ret + "/" + model;
  const arrayDetectAns = fileNames.map((fileName) => {
    const detectPath = dirPath + "/" + fileName;
    const alldetectDirents = fs.readdirSync(detectPath, {
      withFileTypes: true,
    });
    const fileDetectNames = alldetectDirents.map(({ name }) => name);
    return fileDetectNames[fileDetectNames.length - 1];
  });

  //boxとdetext とclas確信ど取り出し
  const arrayDetectBox = arrayDetectAns.map((detectBoxImageName) => {
    var pattern = /[\_]/;
    return detectBoxImageName.split(pattern);
  });

  console.log("-----------");
  res.send(arrayDetectBox);
});

//それぞれのboxフォルダにある確信度と予測クラスがあるbox画像名
app.get("/detect/boxImage", function (req, res) {
  console.log("---/detect/boxImage--------");
  // console.log(req)
  // const fileNames = req.params.boxList;
  const box = req.query.box;
  const imageName = req.query.imageName;
  const model = req.query.model;
  // console.log("detextboxesきた！");
  // console.log(box);
  // console.log(imageName);

  // const boxNum = allDirents.map(({ name }) => name);
  // console.log(fileNames)
  let ret = imageName.replace(".jpg", "");

  const dirPath = "heatmaps.q1000.20211215/" + ret + "/" + model;
  // const arrayDetectAns = fileNames.map((fileName) => {
  const detectPath = dirPath + "/" + box;
  const alldetectDirents = fs.readdirSync(detectPath, {
    withFileTypes: true,
  });
  const fileDetectNames = alldetectDirents
    // .filter((dirent) => !dirent.isFile())
    .map(({ name }) => name);
  // return fileDetectNames[fileDetectNames.length - 1];
  // });
  // console.log(fileDetectNames);
  // return fileDetectNames[fileDetectNames.length-1];
  //boxとdetext とclas確信ど取り出し
  // const arrayDetectBox = arrayDetectAns.map((detectBoxImageName) => {
  //   var pattern = /[\_]/;
  //   return detectBoxImageName.split(pattern);
  // });

  // console.log(arrayDetectBox);
  console.log("-----------");
  res.send(fileDetectNames[fileDetectNames.length - 1]);
});

// サーバーを起動する部分
var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
