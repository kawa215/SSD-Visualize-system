/* eslint-disable no-useless-constructor */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./ImageSelected.module.css";
import ImageDataService from "../services/Image.service";
import { connect } from "react-redux";
import { deleteFactorImage } from "../store/index";
import Slider from "react-slick";

class ImageSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditions: null,
      weathers: [],
      scenes: [],
      timeofdays: [],
      style: {
        backgroundPosition: "0% 0%",
        transformOrigin: "50% 50%",
        transform: "scale(1)",
      },
    };
    this.retrieveConditions = this.retrieveConditions.bind(this);
    this.handleClickBatsu = this.handleClickBatsu.bind(this);
  }

  handleClickBatsu() {
    this.props.deleteFactorImage(
      this.props.indexTarget,
      this.props.indexFactor
    );
  }

  retrieveConditions(name) {
    this.props.changeImage(name);

    ImageDataService.getConditionByName(name)
      .then((response) => {
        console.log(response.data[0].attributes);
        // const traffic_light = {
        //   attributes :{
        //   blue: " go",
        //   yellow:"slow down",
        //   red: "stop"}
        // };

        // console.log(traffic_light.attributes);

        // const data = response.data[0];
        // console.log(data.weather);
        this.props.changeConditions(response.data[0].attributes);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };
    return (
      <div className={styles.ImageView}>
        {this.props.flag !== "true" ? (
          <div>
            <Slider {...settings} className={styles.slider} color="black">
              <div className={styles.imgDiv}>
                <div className={styles.titleBold}>
                  {this.props.flag !== "true" && (
                    <span>
                      - {this.props.model} - <br />
                      検出: {this.props.imageName.replace(".jpg", "")}
                    </span>
                  )}
                </div>
                <img
                  src={this.props.allURL}
                  // className={styles.img}
                  className={styles.img}
                  // onClick={this.retrieveConditions(this.props.imageName)}
                ></img>
              </div>
              <div>
                <div className={styles.titleBold}>
                  {this.props.flag !== "true" && (
                    <span>
                      - {this.props.model} - <br />
                      GT: {this.props.imageName.replace(".jpg", "")}
                    </span>
                  )}
                </div>
                <img
                  src={this.props.grURL}
                  // className={styles.img}
                  // className={`${styles.visualize} ${styles.img}`}
                  className={styles.img}
                  // onClick={this.retrieveConditions(this.props.imageName)}
                ></img>
              </div>
            </Slider>

            {/* <img
              src={this.props.allURL}
              // className={styles.img}
              className={styles.img}
              // onClick={this.retrieveConditions(this.props.imageName)}
            ></img> */}

            <span
              // onClick={this.props.deleteFactorImage(
              //   this.props.indexTarget,
              //   this.props.indexFactor
              // )}
              onClick={this.handleClickBatsu}
              className={styles.batsu}
            >
              ×
            </span>
          </div>
        ) : (
          <div>
            <div className={styles.titleBold}>
              <span>
              {this.props.detect === "正検出" && "正検出 "}
              {this.props.detect === "誤検出" && "誤検出 "}
              {this.props.detect === "misclass" && "誤分類 "}
              {/* {this.props.detect === "正検出" ? "正検出 " : "誤検出　"}
                {this.props.detect === "正検出" ? "正検出 " : "誤検出　"} */}
                box:{" "}
                {this.props.box} <br />
                {this.props.clas} {this.props.score}
              </span>
            </div>
            <Slider {...settings} className={styles.slider} color="black">
              <div className={styles.toumei}>
                <div
                  className={styles.zoomImgSection}
                  style={{
                    height: "120px",
                    background: `url(${this.props.boxURL}) ${this.props.style.backgroundPosition}`,
                    transformOrigin: this.props.style.transformOrigin,
                    transform: this.props.style.transform,
                  }}
                >
                  <img
                    src={this.props.boxURL}
                    className={styles.toumei2}
                    // alt="可視化手法とクラス"
                  ></img>
                  <img
                    src={this.props.viURL}
                    className={styles.toumei3}
                    style={{
                      opacity: `${this.props.opacity}`,
                    }}
                  ></img>
                </div>
              </div>
              <div>
                <img
                  src={this.props.boxURL}
                  // className={styles.img}
                  // className={`${styles.visualize} ${styles.img}`}
                  className={styles.img}
                  // onClick={this.retrieveConditions(this.props.imageName)}
                ></img>
              </div>
            </Slider>

            {/* <img
            src={this.props.allURL}
            // className={styles.img}
            className={styles.img}
            // onClick={this.retrieveConditions(this.props.imageName)}
          ></img> */}

            <span
              // onClick={this.props.deleteFactorImage(
              //   this.props.indexTarget,
              //   this.props.indexFactor
              // )}
              onClick={this.handleClickBatsu}
              className={styles.batsu}
            >
              ×
            </span>
          </div>
        )}
        {/* <span className={styles.round_btn}></span> */}
        {/* <button onClick={this.retrieveConditions(this.props.imageName)}>
          テスト
        </button> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  deleteFactorImage: (targetIndex, factorIndex) =>
    dispatch(deleteFactorImage(targetIndex, factorIndex)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelected);
