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

  on() {
    this.setState({
      imageUrl:
        "http://localhost:4000/box/" +
        this.props.imageName.replace(".jpg", "") +
        // "/" +
        // this.props.model +
        "/" +
        this.props.imageName.replace(".jpg", "") +
        // "_" +
        // this.props.model +
        "_gt.png",
    });
  }

  onLeave() {
    this.setState({
      imageUrl: "http://localhost:4000/vals/" + this.props.imageName,
    });
  }

  retrieveConditions(name) {
    this.props.changeImage(name);

    ImageDataService.getConditionByName(name)
      .then((response) => {
        console.log(response.data[0].attributes);
        // const traffic_light = {
        //   attributes :{
        //   blue: "go",
        //   yellow: "slow down",
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
    return (
      <div className={styles.ImageView}>
        <img
          src={this.state.imageUrl}
          onMouseEnter={this.on}
          onMouseLeave={this.onLeave}
          // className={styles.img}
          className={styles.img}
          onClick={() =>
            this.props.changeImage(
              this.props.imageName,
              this.props.imageWeather,
              this.props.imageScene,
              this.props.imageTimeofday
            )
          }
          // onClick={this.retrieveConditions(this.props.imageName)}
          // onClick={(e) => this.retrieveConditions(this.props.imageName)}
        ></img>
        {/* <button onClick={this.retrieveConditions(this.props.imageName)}>
          テスト
        </button> */}
        <div>{this.props.imageName}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { image: state.image, radio: state.radio };
};

const mapDispatchToProps = (dispatch) => ({
  // changeCount: (count) => dispatch(changeCount()),
  changeImage: (name, weather, scene, timeofday) =>
    dispatch(changeImage(name, weather, scene, timeofday)),
  changeConditions: (attributes) => dispatch(changeConditions(attributes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageView);
