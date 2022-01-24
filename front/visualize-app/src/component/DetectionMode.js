/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./DetectionMode.module.css";
import { connect } from "react-redux";
import { addImages } from "../store/index";
import imageDataService from "../services/Image.service";

class DetectionMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detect: "all",
      box: "",
      method: "",
      class: "",
      boxList: [],
      storeBoxList: [],
      detectBoxList: [],
      classes: [],
      boxImageURL: "",
      selectBoxName: "http://localhost:4000/box/",
      // props.image
      // "_detect_all.png",
    };

    this.handleChangeBox = this.handleChangeBox.bind(this);
    this.handleChangeMethod = this.handleChangeMethod.bind(this);
    this.handleChangeClass = this.handleChangeClass.bind(this);
    this.returnURLimg = this.returnURLimg.bind(this);
    this.returnFileNNamesDetectBox = this.returnFileNNamesDetectBox.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.returnBoxImg = this.returnBoxImg.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.image !== prevProps.image) {
      console.log("-----------");
      console.log(this.props.image);
      console.log(prevProps.image);
      this.setState({ box: "all" });
      this.returnURLimg(this.props.image);
      console.log(this.state.box);
      this.returnBoxImg("all");
      console.log("----無事終わり-------");
    }
  }

  handleChangeRadio(e) {
    // e.preventDefault();
    console.log("--handleChangeRadio---------");
    this.setState({ detect: e.target.value });
    // this.returnBoxImg();
    if (e.target.value === "all") {
      this.returnURLimg(this.props.image);
    } else {
      this.returnFileNNamesDetectBox(this.state.storeBoxList, this.props.image);
    }
    console.log("----無事終わり-------");
  }

  returnFileNNamesDetectBox(boxList, imageName) {
    console.log(" -------returnFileNNamesDetectBox");
    // boxListを元に戻す！！
    console.log(boxList);
    console.log(imageName);
    console.log(boxList);
    if (boxList[0] === "all") boxList.shift();
    imageDataService
      .getDetectBoxList(boxList, imageName, this.props.model)
      .then((response) => {
        console.log(response);
        var copyResponseData = response.data;
        const data = copyResponseData.map((data) => {
          //変更必要
          const detectName = data[6].replace(".png", "");
          return {
            box: data[3],
            class: data[4],
            score: data[5],
            detect: detectName,
          };
        });
        console.log("--------databoxclasとか");
        console.log(data);
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
        console.log("-----浄化");
        console.log(boxListdata);
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

  returnURLimg(imageName) {
    console.log(imageName);
    imageDataService
      .getBoxList(this.props.image, this.props.model)
      .then((response) => {
        console.log(response);
        this.setState({
          boxList: response.data,
          storeBoxList: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  returnBoxImg(box) {
    // var BoxImg;
    var URL;
    console.log("returnBoxImg------");
    console.log(box);
    if (box === "all") {
      console.log("allのif");
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
    } else {
      console.log("all以外！↓");
      //b1c9c847-3bda4659_detect_7759_car_0.844_correct
      imageDataService
        .getBoxImage(box, this.props.image, this.props.model)
        .then((response) => {
          // console.log(response);
          // this.setState({
          //   boxList: response.data,
          //   storeBoxList: response.data,
          // });
          URL =
            "http://localhost:4000/box/" +
            this.props.image.replace(".jpg", "") +
            "/" +
            this.props.model +
            "/" +
            box +
            "/" +
            response.data;
          console.log(URL);
          this.setState({ boxImageURL: URL });
          // console.log(URL);
          // return URL;
        })
        .catch((e) => {
          console.log(e);
        });
      // console.log(URL);
      // return URL;
      // return (
      //   this.state.selectBoxName +
      //   this.props.image.replace(".jpg", "") +
      //   "/" +
      //   this.state.box +
      //   "/" +
      //   this.props.image.replace(".jpg", "") +
      //   "_detect_" +
      //   this.props.box + "_" + this.props.
      // );
    }
  }

  handleChangeBox(event) {
    this.setState({ box: event.target.value });
    this.returnBoxImg(event.target.value);
  }

  handleChangeMethod(event) {
    this.setState({ method: event.target.value });
  }

  handleChangeClass(event) {
    this.setState({ class: event.target.value });
  }

  render() {
    // this.retrieveConditions(this.props.image);
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
            <h3>{this.props.model}</h3>
            <img src={this.state.boxImageURL} className={styles.img}></img>
          </div>
          <label>
            <input
              type="radio"
              name="detect"
              value="all"
              onChange={(e) => this.handleChangeRadio(e)}
              // onChange={this.handleChangeRadio}
            />
            すべて
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="correct"
              // onChange={this.handleChangeRadio}
              onChange={(e) => this.handleChangeRadio(e)}
            />
            正検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="misdetect"
              onChange={(e) => this.handleChangeRadio(e)}
              // onChange={this.handleChangeRadio}
            />
            誤検出
          </label>
          <label className={styles.datec}>
            <input
              className={styles.datec}
              type="radio"
              name="detect"
              value="misclass"
              onChange={(e) => this.handleChangeRadio(e)}
              // onChange={this.handleChangeRadio}
            />
            誤分類
          </label>
          ボックス:
          <select
            className={styles.classic}
            value={this.state.box}
            onChange={this.handleChangeBox}
          >
            {this.state.boxList.map((boxnum, index) => {
              if (index === 0 && boxnum === "all") {
                return (
                  <option selected value="all">
                    all
                  </option>
                );
              } else if (index === 0) {
                return (
                  <option selected value={boxnum}>
                    {boxnum}
                  </option>
                );
              }
              return <option value={boxnum}>{boxnum}</option>;
            })}
          </select>
          <br />
          可視化手法:
          <select
            className={styles.classic}
            value={this.state.method}
            onChange={this.handleChangeMethod}
          >
            <option selected value="">
              Visualization
            </option>
            <option value="ig">Integrated Gradients</option>
            <option value="gradcam">GradCAM</option>
            <option value="deeplift">Deeplift</option>
          </select>
          クラス:
          <select
            className={styles.classic}
            value={this.state.class}
            onChange={this.handleChangeClass}
          >
            <option selected value="">
              class
            </option>
            <option value="bike">Bike</option>
            <option value="bus">Bus</option>
            <option value="car">Car</option>
            <option value="motor">Motor</option>
            <option value="person">Person</option>
            <option value="rider">Rider</option>
            <option value="traffic-light">Traffic light</option>
            <option value="traffic-sign">Traffic sign</option>
            <option value="train">Train</option>
            <option value="truck">Truck</option>
          </select>
        </div>
        <div className={styles.visualizeImages}>
          <div className={styles.visualizeImage}>
            <div>
              {this.state.box}_{this.state.method}_{this.state.class}
            </div>
            <img
              src={
                "http://localhost:4000/box/" +
                this.props.image.replace(".jpg", "") +
                "/" +
                this.props.model +
                "/" +
                this.state.box +
                "/" +
                this.props.image.replace(".jpg", "") +
                "_" +
                this.props.model +
                "_attr_" +
                this.state.box +
                "_" +
                this.state.method +
                "_" +
                this.state.class +
                ".png"
              }
              // className={styles.img}
              className={styles.visualize}
            ></img>
          </div>
          <div className={styles.visualizeImage}>
            <div>
              {this.state.box}_{this.state.method}_bg
            </div>
            <img
              src={
                "http://localhost:4000/box/" +
                this.props.image.replace(".jpg", "") +
                "/" +
                this.props.model +
                "/" +
                this.state.box +
                "/" +
                this.props.image.replace(".jpg", "") +
                "_" +
                this.props.model +
                "_attr_" +
                this.state.box +
                "_" +
                this.state.method +
                "_bg.png"
              }
              // className={styles.img}
              className={styles.visualize}
            ></img>
          </div>
          <div className={styles.button04}>
            <a
              onClick={() =>
                this.props.addImages(
                  this.props.image,
                  this.props.weather,
                  this.props.scene,
                  this.props.timeofday,
                  this.state.boxImageURL,
                  this.state.box,
                  "http://localhost:4000/box/" +
                    this.props.image.replace(".jpg", "") +
                    "/" +
                    this.props.model +
                    "/" +
                    this.state.box +
                    "/" +
                    this.props.image.replace(".jpg", "") +
                    "_" +
                    this.props.model +
                    "_attr_" +
                    this.state.box +
                    "_" +
                    this.state.method +
                    "_" +
                    this.state.class +
                    ".png",
                  this.state.detect,
                  this.state.method,
                  this.state.class
                )
              }
            >
              比較ビューに追加
            </a>
          </div>
          <div className={styles.button03}>
            <a
              onClick={() =>
                this.props.addImages(
                  this.props.image,
                  this.props.weather,
                  this.props.scene,
                  this.props.timeofday,
                  this.state.boxImageURL,
                  this.state.box,
                  "http://localhost:4000/box/" +
                    this.props.image.replace(".jpg", "") +
                    "/" +
                    this.props.model +
                    "/" +
                    this.state.box +
                    "/" +
                    this.props.image.replace(".jpg", "") +
                    "_" +
                    this.props.model +
                    "_attr_" +
                    this.state.box +
                    "_" +
                    this.state.method +
                    "_bg.png",
                  this.state.detect,
                  this.state.method,
                  this.state.class
                )
              }
            >
              比較ビューに追加
            </a>
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
