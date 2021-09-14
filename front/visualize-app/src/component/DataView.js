/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./DataView.module.css";
import { connect } from "react-redux";
import { addImages, changeCount, changeImage } from "../store/index";
import Sample from "./sample.png";
class DataView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          可視化手法選択
          <label>
            <input
              type="radio"
              name="detect"
              value="正検出"
              // onChange={this.handleChangeRadio}
            />
            正検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="誤検出"
              // onChange={this.handleChangeRadio}
            />
            誤検出
          </label>
          <br />
          ボックス:
          <select
            className={styles.classic}
            // value={this.state.weather}
            // onChange={this.handleChangeWeather}
          >
            <option selected value="">
              ALL
            </option>
            <option value="snowy">Box1</option>
            <option value="snowy">Box2</option>
            <option value="clear">Box3</option>
            <option value="overcast">Box4</option>
            <option value="undefined">Box5</option>
          </select>
          可視化手法:
          <select
            className={styles.classic}
            // value={this.state.weather}
            // onChange={this.handleChangeWeather}
          >
            <option selected value="">
              Integrated Gradients
            </option>
            <option value="snowy">GradCAM</option>
            <option value="clear">Deeplift</option>
          </select>
          クラス:
          <select
            className={styles.classic}
            // value={this.state.weather}
            // onChange={this.handleChangeWeather}
          >
            <option selected value="">
              Bicycle
            </option>
            <option value="rainy">traffic sign</option>
            <option value="snowy">traffic light"</option>
            <option value="clear">car</option>
            <option value="overcast">drivable area</option>
            <option value="undefined">lane</option>
          </select>
        </div>
        <img
          src={Sample}
          // className={styles.img}
          className={styles.visualize}
        ></img>
        <div className={styles.button03}>
          <a  onClick={(e) => this.props.addImages(this.props.image)}> 比較ビューに追加</a>
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
  addImages: (name) => dispatch(addImages(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
