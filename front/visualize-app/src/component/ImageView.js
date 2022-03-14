/* eslint-disable no-useless-constructor */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./ImageView.module.css";
import { connect } from "react-redux";
import { changeImage, changeConditions } from "../store/index";
import ImageDataService from "../services/Image.service";
class ImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditions: null,
      weathers: [],
      scenes: [],
      timeofdays: [],
      imageUrl: "http://localhost:4000/vals/" + this.props.imageName,
    };
    this.retrieveConditions = this.retrieveConditions.bind(this);
    this.on = this.on.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  //マウスオーバー
  on() {
    this.setState({
      imageUrl:
        "http://localhost:4000/box/" +
        this.props.imageName.replace(".jpg", "") +
        "/" +
        this.props.imageName.replace(".jpg", "") +
        "_gt.png",
    });
  }

  // マウスリーブ
  onLeave() {
    this.setState({
      imageUrl: "http://localhost:4000/vals/" + this.props.imageName,
    });
  }

  // 画像名指定　attributes取得
  retrieveConditions(name) {
    this.props.changeImage(name);

    ImageDataService.getConditionByName(name)
      .then((response) => {
        this.props.changeConditions(response.data[0].attributes);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div className={styles.ImageView}>
        <img
          src={this.state.imageUrl}
          onMouseEnter={this.on}
          onMouseLeave={this.onLeave}
          className={styles.img}
          onClick={() =>
            this.props.changeImage(
              this.props.imageName,
              this.props.imageWeather,
              this.props.imageScene,
              this.props.imageTimeofday
            )
          }
        ></img>
        <div>{this.props.imageName}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { image: state.image, radio: state.radio };
};

const mapDispatchToProps = (dispatch) => ({
  changeImage: (name, weather, scene, timeofday) =>
    dispatch(changeImage(name, weather, scene, timeofday)),
  changeConditions: (attributes) => dispatch(changeConditions(attributes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageView);
