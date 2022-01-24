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

  componentDidUpdate(prevProps) {
    if (
      this.props.image !== prevProps.image ||
      this.props.model !== prevProps.model
    ) {
      console.log("-----------");
      console.log(this.props.image);
      console.log(prevProps.image);
      this.setState({
        box: "all",
        classes: [],
        pose: false,
        style: {
          backgroundPosition: "0% 0%",
          transformOrigin: "50% 50%",
          transform: "scale(1)",
        },
      });
      this.returnURLimg(this.props.image);
      console.log(this.state.box);
      this.returnBoxImg("all");
      console.log("----無事終わり-------");
    }
  }

  returnALLorFactorImageURL() {
    console.log("--------------------returnFactororALL");
    console.log(this.state.box);
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

  handleChangeRadio(e) {
    console.log("--handleChangeRadio---------");
    this.setState({ detect: e.target.value });
    if (e.target.value === "all") {
      this.returnURLimg(this.props.image);
    } else {
      this.returnFileNNamesDetectBox(this.state.storeBoxList, this.props.image);
    }
    console.log("----無事終わり-------");
  }

  handleChangeOpacity(e) {
    this.setState({ opacity: e.target.value });
  }

  handleChangeScale(e) {
    this.onMouseOver();
    this.setState({ scale: e.target.value });
  }

  onMouseMove(event) {
    console.log("--------onMouseMove");
    if (!this.state.pose) {
      const { left, top, width } = event.currentTarget.getBoundingClientRect();
      console.log(event.currentTarget.getBoundingClientRect());
      console.log(event.pageX);
      console.log(event.pageY);
      const height = 350;
      const x = ((event.pageX - left) / width) * 100;
      const y = ((event.pageY - 175) / height) * 100;

      this.setState((prevState) => ({
        style: {
          ...prevState.style, // copy all other key-value pairs of food object
          // copy all pizza key-value pairs
          transformOrigin: `${x}% ${y}%`,
          backgroundPosition: `${x}% ${y}%`, // update value of specific key
        },
      }));
    }
  }

  onMouseOver() {
    console.log("--------onMouseOver");
    this.setState({ ...this.state });
    this.setState((prevState) => ({
      style: {
        ...prevState.style, // copy all other key-value pairs of food object
        // copy all pizza key-value pairs
        transform: `scale(${this.state.scale})`, // update value of specific key
      },
    }));
  }

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

  onMouseLeave() {
    console.log("--------onMouseLeave");
    this.setState((prevState) => ({
      style: {
        ...prevState.style, // copy all other key-value pairs of food object
        // copy all pizza key-value pairs
        transform: `scale(${this.state.scale})`, // update value of specific key
      },
    }));
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
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  handleChangeBox(event) {
    this.setState({ box: event.target.value });
    this.returnBoxImg(event.target.value);
  }

  handleChangeMethod(event) {
    this.setState({ method: event.target.value });
    this.getClassList(
      this.props.model,
      this.props.image,
      this.state.box,
      event.target.value
    );
  }

  handleChangeClass(event) {
    this.setState({ class: event.target.value });
  }

  getClassList(model, imageName, box, method) {
    imageDataService
      .getClassList(model, imageName, box, method)
      .then((response) => {
        console.log(response);
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

  addImages() {
    var visualizedImageURL;
    const imageWithoutJpg = this.props.image.replace(".jpg", "");
    if (this.state.box === "all") {
      // console.log("addimages: all")
      // console.log())
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
      console.log("addimages: box");
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
      this.state.class
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
          <img alt="" src={this.state.boxImageURL} className={styles.img}></img>
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
            {this.state.classes.map((clas, index) => {
              return <option value={clas}>{clas}</option>;
            })}
          </select>
        </div>
        <div className={styles.visualizeImages}>
          {/* <h2> </h2> */}
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

                // alt="可視化手法とクラス"
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

export default connect(mapStateToProps, mapDispatchToProps)(FactorMapMode);
