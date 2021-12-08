/* eslint-disable no-useless-constructor */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./ImageSelected.module.css";
import ImageDataService from "../services/Image.service";
import { connect } from "react-redux";
import { deleteFactorImage } from "../store/index";
class ImageSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditions: null,
      weathers: [],
      scenes: [],
      timeofdays: [],
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
    return (
      <div className={styles.ImageView}>
        <div className={styles.titleBold}>
          {this.props.flag !== "true" && <span> {this.props.imageName}</span>}
        </div>
        <img
          src={"http://localhost:4000/vals/" + this.props.imageName}
          // className={styles.img}
          className={styles.img}
          // onClick={this.retrieveConditions(this.props.imageName)}
        ></img>
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
