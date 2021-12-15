var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();

const fs = require("fs");

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use("/vals", express.static("val"));

app.use("/viss", express.static("vis"));

app.use("/box", express.static("heatmaps.1000"));

// HTTPリクエストを受け取る部分
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/:imageName", function (req, res) {
  console.log("-----------");
  const imageName = req.params.imageName;

  let ret = imageName.replace(".jpg", "");

  const dirPath = "heatmaps.1000/" + ret;

  console.log("imageNameきた！");
  console.log(dirPath);

  // "path/to/target" 直下のファイルやディレクトリ全てがDirentオブジェクトの配列で返ってくる
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const fileNames = allDirents
    .filter((dirent) => !dirent.isFile())
    .map(({ name }) => name);
  console.log(allDirents);
  console.log(fileNames);
  console.log(allDirents[0].name);
  // const boxNum = allDirents.map(({ name }) => name);
  // console.log(fileNames)
  // const arrayDetectAns = fileNames.map((fileName)=>{
  //   const detectPath = dirPath + "/" + fileName;
  //   const alldetectDirents = fs.readdirSync(detectPath, { withFileTypes: true });
  //   const fileDetectNames = alldetectDirents
  //   // .filter((dirent) => !dirent.isFile())
  //   .map(({ name }) => name);
  //   return fileDetectNames[fileDetectNames.length-1];
  // });
  // console.log(arrayDetectAns);
  console.log("-----------");
  fileNames.unshift("all");
  res.send(fileNames);
});

app.get("/detect/detectBoxes", function (req, res) {
  console.log("---detextboxes--------");
  // console.log(req)
  // const fileNames = req.params.boxList;
  const fileNames = req.query.boxList;
  const imageName = req.query.imageName;
  console.log("detextboxesきた！");
  console.log(fileNames);
  console.log(imageName);

  // const boxNum = allDirents.map(({ name }) => name);
  // console.log(fileNames)
  let ret = imageName.replace(".jpg", "");

  const dirPath = "heatmaps.1000/" + ret;
  const arrayDetectAns = fileNames.map((fileName) => {
    const detectPath = dirPath + "/" + fileName;
    const alldetectDirents = fs.readdirSync(detectPath, {
      withFileTypes: true,
    });
    const fileDetectNames = alldetectDirents
      // .filter((dirent) => !dirent.isFile())
      .map(({ name }) => name);
    return fileDetectNames[fileDetectNames.length - 1];
  });
  console.log(arrayDetectAns);

  //boxとdetext とclas確信ど取り出し
  const arrayDetectBox = arrayDetectAns.map((detectBoxImageName) => {
    var pattern = /[\_]/;
    return detectBoxImageName.split(pattern);
  });

  console.log(arrayDetectBox);
  console.log("-----------");
  res.send(arrayDetectBox);
});

app.get("/detect/boxImage", function (req, res) {
  console.log("---boximmmage--------");
  // console.log(req)
  // const fileNames = req.params.boxList;
  const box = req.query.box;
  const imageName = req.query.imageName;
  console.log("detextboxesきた！");
  console.log(box);
  console.log(imageName);

  // const boxNum = allDirents.map(({ name }) => name);
  // console.log(fileNames)
  let ret = imageName.replace(".jpg", "");

  const dirPath = "heatmaps.1000/" + ret;
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
  console.log(fileDetectNames);
  // return fileDetectNames[fileDetectNames.length-1];
  //boxとdetext とclas確信ど取り出し
  // const arrayDetectBox = arrayDetectAns.map((detectBoxImageName) => {
  //   var pattern = /[\_]/;
  //   return detectBoxImageName.split(pattern);
  // });

  // console.log(arrayDetectBox);
  console.log("-----------");
  res.send(fileDetectNames[fileDetectNames.length-1]);
});

// サーバーを起動する部分
var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
