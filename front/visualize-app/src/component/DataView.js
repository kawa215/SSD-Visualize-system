/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./DataView.module.css";
import { connect } from "react-redux";
import { addImages } from "../store/index";
import Sample from "./sample.png";
class DataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detect: "",
      box: "",
      method: "",
      class: "",
    };

    this.handleChangeBox = this.handleChangeBox.bind(this);
    this.handleChangeMethod = this.handleChangeMethod.bind(this);
    this.handleChangeClass = this.handleChangeClass.bind(this);
  }

  handleChangeBox(event) {
    this.setState({ box: event.target.value });
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
        <div>
          name:「　{this.props.image}　」 attributes:
          <span className={styles.weather}> {this.props.weather} </span>
          <span className={styles.weather}>{this.props.scene}</span>
          <span className={styles.weather}>{this.props.timeofday}</span>
          {/* {this.state.conditions.map((condition) => {
          return <div>{condition}</div>;
        })} */}
          <img
            src={"http://localhost:4000/vals/" + this.props.image}
            // className={styles.img}
            className={styles.img}
          ></img>
          {/* 可視化手法選択 */}
          {/* <br /> */}
          ボックス:
          <select
            className={styles.classic}
            value={this.state.box}
            onChange={this.handleChangeBox}
          >
            <option selected value="ALL">
              ALL
            </option>
            <option value="1">Box1</option>
            <option value="2">Box2</option>
            <option value="3">Box3</option>
            <option value="4">Box4</option>
            <option value="5">Box5</option>
            <option value="6">Box6</option>
            <option value="7">Box7</option>
            <option value="8">Box8</option>
            <option value="9">Box9</option>
            <option value="10">Box10</option>
          </select>
          <label>
            <input
              type="radio"
              name="detect"
              value="正検出"
              // onChange={this.handleChangeRadio}
              onChange={() => this.setState({ radio: "正検出" })}
            />
            正検出
          </label>
          <label className={styles.datec}>
            <input
              className={styles.datec}
              type="radio"
              name="detect"
              value="誤検出"
              onChange={() => this.setState({ radio: "誤検出" })}
              // onChange={this.handleChangeRadio}
            />
            誤検出
          </label>
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
            <option value="Integrated Gradients">Integrated Gradients</option>
            <option value="GradCAM">GradCAM</option>
            <option value="Deeplift">Deeplift</option>
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
            <option value="bar">Car</option>
            <option value="motor">Motor</option>
            <option value="person">Person</option>
            <option value="rider">Rider</option>
            <option value="traffic light">Traffic light</option>
            <option value="traffic sign">Traffic sign</option>
            <option value="train">Train</option>
            <option value="truck">Truck</option>
          </select>
        </div>
        <img
          src={Sample}
          // className={styles.img}
          className={styles.visualize}
        ></img>
        <div className={styles.button03}>
          <a
            onClick={() =>
              this.props.addImages(
                this.props.image,
                this.props.weather,
                this.props.scene,
                this.props.timeofday,
                this.state.box,
                this.state.method,
                this.state.class
              )
            }
          >
            比較ビューに追加
          </a>
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  addImages: (image, weather, scene, timeofday, box, method, clas) =>
    dispatch(addImages(image, weather, scene, timeofday, box, method, clas)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
