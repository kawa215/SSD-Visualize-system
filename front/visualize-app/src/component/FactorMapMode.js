/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./FactorMapMode.module.css";
import { connect } from "react-redux";
import { addImages } from "../store/index";
import imageDataService from "../services/Image.service";
import Slider from "react-slick";
import { Slider as A } from "@material-ui/core";
import Box from "@material-ui/core/Box";
class FactorMapMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radio: [true, false, false, false],
      detect: "all",
      box: "",
      method: "",
      class: "",
      boxList: [],
      storeBoxList: [],
      detectBoxList: [],
      classes: [],
      boxImageURL: "",
      factorImageURL: "",
      selectBoxName: "http://localhost:4000/box/",
      opacity: 0.99,
      zoom: 1,
      style: {
        backgroundPosition: "0% 0%",
        transformOrigin: "50% 50%",
        transform: "scale(1)",
      },
      pose: false,
      scale: 2.5,
    };

    this.handleChangeBox = this.handleChangeBox.bind(this);
    this.handleChangeMethod = this.handleChangeMethod.bind(this);
    this.handleChangeClass = this.handleChangeClass.bind(this);
    this.returnURLimg = this.returnURLimg.bind(this);
    this.returnFileNNamesDetectBox = this.returnFileNNamesDetectBox.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleChangeOpacity = this.handleChangeOpacity.bind(this);
    this.returnBoxImg = this.returnBoxImg.bind(this);
    this.addImages = this.addImages.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.activatePose = this.activatePose.bind(this);
    this.handleChangeScale = this.handleChangeScale.bind(this);
    this.returnALLorFactorImageURL = this.returnALLorFactorImageURL.bind(this);
  }

  // conponentレンダリングされた時
  componentDidUpdate(prevProps) {
    if (
      this.props.image !== prevProps.image ||
      this.props.model !== prevProps.model
    ) {
      this.setState({
        radio: [true, false, false, false],
        box: "all",
        detect: "all",
        classes: [],
        boxList: ["all"],
        pose: false,
        style: {
          backgroundPosition: "0% 0%",
          transformOrigin: "50% 50%",
          transform: "scale(1)",
        },
      });

      this.returnURLimg(this.props.image);
      this.returnBoxImg("all");
    }
  }

  // 要因マップ画像のURLを取得
  returnALLorFactorImageURL() {
    var imageURL;
    if (this.state.box === "all") {
      imageURL = this.state.boxImageURL;
      return imageURL;
    } else {
      imageURL =
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
        ".png";
      return imageURL;
    }
  }

  // radioボタン変更された時
  handleChangeRadio(e) {
    this.setState({ detect: e.target.value });
    if (e.target.value === "all") {
      this.setState({
        radio: [true, false, false, false],
        box: "all",
        detect: "all",
        classes: [],
        boxList: ["all"],
        pose: false,
        style: {
          backgroundPosition: "0% 0%",
          transformOrigin: "50% 50%",
          transform: "scale(1)",
        },
      });

      this.returnBoxImg(e.target.value);
    } else {
      if (e.target.value === "correct") {
        this.setState({
          radio: [false, true, false, false],
        });
      } else if (e.target.value === "misdetect") {
        this.setState({
          radio: [false, false, true, false],
        });
      } else {
        this.setState({
          radio: [false, false, false, true],
        });
      }
      this.returnFileNNamesDetectBox(this.state.storeBoxList, this.props.image);
    }
  }

  // 透明度調整
  handleChangeOpacity(e) {
    this.setState({ opacity: e.target.value });
  }

  // 拡大度調整
  handleChangeScale(e) {
    this.onMouseOver();
    this.setState({ scale: e.target.value });
  }

  // 要因マップの上でマウスを動かす時
  onMouseMove(event) {
    if (!this.state.pose) {
      const { left, top, width } = event.currentTarget.getBoundingClientRect();
      const height = 350;
      const x = ((event.pageX - left) / width) * 100;
      const y = ((event.pageY - 175) / height) * 100;

      this.setState((prevState) => ({
        style: {
          ...prevState.style, 
          transformOrigin: `${x}% ${y}%`,
          backgroundPosition: `${x}% ${y}%`, 
        },
      }));
    }
  }

  // マウスオーバー
  onMouseOver() {
    this.setState({ ...this.state });
    this.setState((prevState) => ({
      style: {
        ...prevState.style, 
        transform: `scale(${this.state.scale})`,
      },
    }));
  }

  // 調整した度数でポーズする
  activatePose() {
    if (!this.state.pose) {
      this.setState({
        pose: true,
      });
    } else {
      this.setState({
        pose: false,
      });
    }
  }

  // マウスリーブ
  onMouseLeave() {
    this.setState((prevState) => ({
      style: {
        ...prevState.style, 
        transform: `scale(${this.state.scale})`, 
      },
    }));
  }

  // 要因マップのファイル名やボックス クラスなどを取得
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

  // 画像名とモデルを指定してボックスリストを取得
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

  // ボックス画像のURL取得
  returnBoxImg(box) {
    var URL;
    if (box === "all") {
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
      imageDataService
        .getBoxImage(box, this.props.image, this.props.model)
        .then((response) => {
          URL =
            "http://localhost:4000/box/" +
            this.props.image.replace(".jpg", "") +
            "/" +
            this.props.model +
            "/" +
            box +
            "/" +
            response.data;
          this.setState({ boxImageURL: URL });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  // ボックスを変更した時
  handleChangeBox(event) {
    this.setState({ box: event.target.value });
    this.returnBoxImg(event.target.value);
  }

  // 可視化手法変更した時
  handleChangeMethod(event) {
    this.setState({ method: event.target.value });
    this.getClassList(
      this.props.model,
      this.props.image,
      this.state.box,
      event.target.value
    );
  }

  // クラス変更した時
  handleChangeClass(event) {
    this.setState({ class: event.target.value });
  }

  // クラスのリストを取得
  getClassList(model, imageName, box, method) {
    imageDataService
      .getClassList(model, imageName, box, method)
      .then((response) => {
        if (response.data) {
          this.setState({
            classes: response.data,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // 比較ビューに追加を押した時
  addImages() {
    var visualizedImageURL;
    const imageWithoutJpg = this.props.image.replace(".jpg", "");
    var score = 0;

    if (this.state.box === "all") {
      visualizedImageURL =
        "http://localhost:4000/box/" +
        imageWithoutJpg +
        "/" +
        this.props.model +
        "/" +
        imageWithoutJpg +
        "_" +
        this.props.model +
        "_detect_all.png";
    } else {
      var scoreIndex = this.state.detectBoxList.findIndex(
        ({ box }) => box === this.state.box
      );
      score = this.state.detectBoxList[scoreIndex].score;
      visualizedImageURL =
        "http://localhost:4000/box/" +
        imageWithoutJpg +
        "/" +
        this.props.model +
        "/" +
        this.state.box +
        "/" +
        imageWithoutJpg +
        "_" +
        this.props.model +
        "_attr_" +
        this.state.box +
        "_" +
        this.state.method +
        "_" +
        this.state.class +
        ".png";
    }

    this.props.addImages(
      this.props.image,
      this.props.weather,
      this.props.scene,
      this.props.timeofday,
      this.state.boxImageURL,
      this.state.box,
      visualizedImageURL,
      this.state.detect,
      this.state.method,
      this.state.class,
      this.state.pose,
      this.state.opacity,
      this.state.scale,
      this.state.style,
      score,
    );
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };

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
          <img alt="" src={this.state.boxImageURL} className={styles.img}></img>
          <label>
            <input
              type="radio"
              name="detect"
              value="all"
              onChange={(e) => this.handleChangeRadio(e)}
              checked={this.state.radio[0]}
            />
            すべて
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="correct"
              onChange={(e) => this.handleChangeRadio(e)}
              checked={this.state.radio[1]}
            />
            正検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="misdetect"
              onChange={(e) => this.handleChangeRadio(e)}
              checked={this.state.radio[2]}
            />
            誤検出
          </label>
          <label className={styles.datec}>
            <input
              className={styles.datec}
              type="radio"
              name="detect"
              value="misclass"
              checked={this.state.radio[3]}
              onChange={(e) => this.handleChangeRadio(e)}
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
              } else if (index === 0 && this.state.detect !== "all") {
                return (
                  <option selected value={boxnum}>
                    {boxnum}
                  </option>
                );
              }
              if (this.state.detect !== "all")
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
            {this.state.classes.map((clas, index) => {
              return <option value={clas}>{clas}</option>;
            })}
          </select>
        </div>
        <div className={styles.visualizeImages}>
          <Slider {...settings} className={styles.slider} color="black">
            <div>
              <h3>
                {" "}
                {this.state.box}_{this.state.method}_{this.state.class}
              </h3>

              <img
                src={
                  this.state.box === "all"
                    ? this.state.boxImageURL
                    : "http://localhost:4000/box/" +
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
                className={styles.visualize}
              ></img>
            </div>
            <div>
              <h3>
                {" "}
                {this.state.box}_{this.state.method}_{this.state.class}
              </h3>
              <div className={styles.toumei}>
                <div
                  onMouseMove={(e) => this.onMouseMove(e)}
                  onMouseOver={this.onMouseOver}
                  onMouseLeave={this.onMouseLeave}
                  onClick={this.activatePose}
                  className={styles.zoomImgSection}
                  style={{
                    height: "300px",
                    background: `url(${this.state.boxImageURL}) ${this.state.style.backgroundPosition}`,
                    transformOrigin: this.state.style.transformOrigin,
                    transform: this.state.style.transform,
                  }}
                >
                  <img
                    src={this.state.boxImageURL}
                    className={styles.toumei2}
                    // alt="可視化手法とクラス"
                  ></img>
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
                    className={styles.toumei3}
                    style={{
                      opacity: `${this.state.opacity}`,
                    }}
                  ></img>
                </div>
              </div>
            </div>
          </Slider>

          <div className={styles.slide}>
            <Box sx={{ width: 260 }}>
              マスク調節:
              <A
                valueLabelDisplay="on"
                min={0.01}
                max={0.99}
                step={0.01}
                aria-label="Volume"
                value={this.state.opacity}
                onChange={(e) => this.handleChangeOpacity(e)}
              />
              拡大スケール:
              <A
                valueLabelDisplay="on"
                min={1}
                max={4}
                step={0.2}
                aria-label="Volume"
                value={this.state.scale}
                onChange={(e) => this.handleChangeScale(e)}
              />
            </Box>
          </div>
        </div>
        <div className={styles.button04}>
          <a onClick={() => this.addImages()}>比較ビューに追加</a>
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
    clas,
    pose,
    opacity,
    scale,
    style,
    score
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
        clas,
        pose,
        opacity,
        scale,
        style,
        score
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactorMapMode);
