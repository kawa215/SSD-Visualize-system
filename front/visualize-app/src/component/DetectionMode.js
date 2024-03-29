/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./DetectionMode.module.css";
import { connect } from "react-redux";
import { addImages } from "../store/index";
import imageDataService from "../services/Image.service";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function createData(model, correct, misdetect, misclass) {
  return { model: model, correct, misdetect, misclass };
}

// モデル情報
const rows = [
  createData("m0001", 7312, 1410, 213),
  createData("m0002", 3383, 4830, 110),
  createData("m0003", 1984, 459, 260),
];

class DetectionMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detect: "all",
      model: "",
      box: "",
      method: "",
      class: "",
      boxList: [],
      storeBoxList: [],
      detectBoxList: [],
      classes: [],
      boxImageURL: "",
      baseURL: "http://localhost:4000/box/",
      rows: rows,
      displayRows: [],
      models: ["m0001", "m0002", "m0003"],
    };

    this.handleChangeBox = this.handleChangeBox.bind(this);
    this.handleChangeMethod = this.handleChangeMethod.bind(this);
    this.handleChangeClass = this.handleChangeClass.bind(this);
    this.returnURLimg = this.returnURLimg.bind(this);
    this.returnFileNNamesDetectBox = this.returnFileNNamesDetectBox.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.returnBoxImg = this.returnBoxImg.bind(this);
    this.handleChangeModel = this.handleChangeModel.bind(this);
    this.getPerformanceScore = this.getPerformanceScore.bind(this);
  }

  // コンポーネント更新された時
  componentDidUpdate(prevProps) {
    if (
      this.props.image !== prevProps.image ||
      this.props.model !== prevProps.model
    ) {
      this.getPerformanceScore(this.props.image, this.props.model, 0);
      this.returnBoxImg();
    }
  }

  // 予測精度のスコアを取得
  getPerformanceScore(image, model, index) {
    imageDataService
      .getPerformanceScore(image, model)
      .then((response) => {
        var copyResponseData = response.data;
        var copydisplayRows = this.state.displayRows;
        copydisplayRows[index] = createData(
          this.props.image,
          copyResponseData[0],
          copyResponseData[1],
          copyResponseData[2]
        );
        const displayModel = this.state.rows.find((row) => row.model === model);
        copydisplayRows[index + 1] = displayModel;
        console.log(copydisplayRows);
        this.setState({
          displayRows: copydisplayRows,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // モデルを変更したき
  handleChangeModel(event) {
    var val = event.target.value;
    this.setState({ model: val });
    if (val !== "") {
      this.getPerformanceScore(this.props.image, val, 2);
    }
  }

  // radioボタン変更した時
  handleChangeRadio(e) {
    this.setState({ detect: e.target.value });
    if (e.target.value === "all") {
      this.returnURLimg(this.props.image);
    } else {
      this.returnFileNNamesDetectBox(this.state.storeBoxList, this.props.image);
    }
  }

  // ボックス クラス　確信度 などを取得
  returnFileNNamesDetectBox(boxList, imageName) {
    if (boxList[0] === "all") boxList.shift();
    imageDataService
      .getDetectBoxList(boxList, imageName, this.props.model)
      .then((response) => {
        var copyResponseData = response.data;
        const data = copyResponseData.map((data) => {
          const detectName = data[6].replace(".png", "");
          return {
            box: data[3],
            class: data[4],
            score: data[5],
            detect: detectName,
          };
        });
        this.setState({
          detectBoxList: data,
        });
        var boxListdata = data.map((data) => {
          if (data.detect === this.state.detect) {
            return data.box;
          } else {
            return undefined;
          }
        });
        boxListdata = boxListdata.filter((v) => v);
        this.setState({
          boxList: boxListdata,
          box: boxListdata[0],
        });
        this.returnBoxImg(boxListdata[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // ボックスリストを取得
  returnURLimg(imageName) {
    imageDataService
      .getBoxList(this.props.image, this.props.model)
      .then((response) => {
        this.setState({
          boxList: response.data,
          storeBoxList: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // 全てのボックスが写っている画像のURLを取得
  returnBoxImg() {
    var URL;
    URL =
      "http://localhost:4000/box/" +
      this.props.image.replace(".jpg", "") +
      "/" +
      this.props.model +
      "/" +
      this.props.image.replace(".jpg", "") +
      "_" +
      this.props.model +
      "_detect_all.png";

    this.setState({ boxImageURL: URL });
  }

  // boxが変更された時
  handleChangeBox(event) {
    this.setState({ box: event.target.value });
    this.returnBoxImg(event.target.value);
  }

  // 可視化手法が変更された時
  handleChangeMethod(event) {
    this.setState({ method: event.target.value });
  }

  // クラスが変更された時
  handleChangeClass(event) {
    this.setState({ class: event.target.value });
  }

  render() {
    return (
      <div className={styles.DataView}>
        <div className={styles.condition}>
          name:「　{this.props.image}　」
          <div className={styles.attributes}>
            attributes:
            <span className={styles.weather}> {this.props.weather} </span>
            <span className={styles.weather}>{this.props.scene}</span>
            <span className={styles.weather}>{this.props.timeofday}</span>
          </div>
          <div className={styles.modelDetectALLImg}>
            <h3 className={styles.modelName}>検出結果:　{this.props.model}　</h3>
            <img src={this.state.boxImageURL} className={styles.img}></img>
          </div>
          <TableContainer className={styles.container} component={Paper}>
            <Table
              sx={{ minWidth: 450 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <h4>Name</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4>Correct</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4>Misdetect</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4>Misclass</h4>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.displayRows.map((row, index) => {
                  if (index < 2) {
                    return (
                      <TableRow
                        key={row.model}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <h5>{row.model}</h5>
                        </TableCell>
                        <TableCell align="center">
                          <h5>{row.correct}</h5>
                        </TableCell>
                        <TableCell align="center">
                          <h5>{row.misdetect}</h5>
                        </TableCell>
                        <TableCell align="center">
                          <h5>{row.misclass}</h5>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={styles.visualizeImages}>
          <div>
            モデル:
            <select
              className={styles.classic}
              value={this.state.model}
              onChange={this.handleChangeModel}
            >
              <option selected value="">
                Ground truth
              </option>
              {this.state.models.map((model) => {
                if (this.props.model !== model) {
                  return <option value={model}>{model}</option>;
                }
              })}
            </select>
            <div className={styles.compareDetectALLImg}>
              <h3 className={styles.modelName}>
                {this.state.model !== ""
                  ? "検出結果:　" + this.state.model
                  : "Ground truth"}
              </h3>
              <img
                src={
                  this.state.model === ""
                    ? this.state.baseURL +
                      this.props.image.replace(".jpg", "") +
                      "/" +
                      this.props.image.replace(".jpg", "") +
                      "_gt.png"
                    : this.state.baseURL +
                      this.props.image.replace(".jpg", "") +
                      "/" +
                      this.state.model +
                      "/" +
                      this.props.image.replace(".jpg", "") +
                      "_" +
                      this.state.model +
                      "_detect_all.png"
                }
                className={styles.img}
              ></img>
              {this.state.model !== "" && (
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 450 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <h4>Name</h4>
                        </TableCell>
                        <TableCell align="center">
                          <h4>Correct</h4>
                        </TableCell>
                        <TableCell align="center">
                          <h4>Misdetect</h4>
                        </TableCell>
                        <TableCell align="center">
                          <h4>Misclass</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.displayRows.map((row, index) => {
                        if (index > 1) {
                          return (
                            <TableRow
                              key={row.model}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <h5>{row.model}</h5>
                              </TableCell>
                              <TableCell align="center">
                                <h5>{row.correct}</h5>
                              </TableCell>
                              <TableCell align="center">
                                <h5>{row.misdetect}</h5>
                              </TableCell>
                              <TableCell align="center">
                                <h5>{row.misclass}</h5>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    image: state.image,
    weather: state.weather,
    scene: state.scene,
    timeofday: state.timeofday,
    count: state.count,
    model: state.model,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addImages: (
    image,
    weather,
    scene,
    timeofday,
    boxImageURL,
    box,
    visualizedImageURL,
    detect,
    method,
    clas
  ) =>
    dispatch(
      addImages(
        image,
        weather,
        scene,
        timeofday,
        boxImageURL,
        box,
        visualizedImageURL,
        detect,
        method,
        clas
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetectionMode);
