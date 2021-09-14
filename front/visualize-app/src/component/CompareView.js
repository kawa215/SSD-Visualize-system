/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./CompareView.module.css";
import { connect } from "react-redux";
import ImageView from "./ImageView";
import { changeCount, changeImage } from "../store/index";
import Sample from "./sample.png";

class CompareView extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    // this.retrieveConditions(this.props.image);
    return (
      <div className={styles.CompareView}>
        フィルター
        <select
          className={styles.classic}
          // value={this.state.weather}
          // onChange={this.handleChangeWeather}
        >
          <option selected value="">
            Whether
          </option>
          <option value="rainy">rainy</option>
          <option value="snowy">snowy</option>
          <option value="clear">clear</option>
          <option value="overcast">overcast</option>
          <option value="undefined">undefined</option>
          <option value="party cloudy">party cloudy</option>
          <option value="foggy">foggy</option>
        </select>
        <select
          className={styles.classic}
          value={this.state.scene}
          onChange={this.handleChangeScene}
        >
          <option selected value="">
            Scene
          </option>
          <option value="tunnel">tunnel</option>
          <option value="residential">residential</option>
          <option value="parking lot">parking lot</option>
          <option value="undefined">undefined</option>
          <option value="city street">city street</option>
          <option value="gas stations">gas stations</option>
          <option value="highway">highway</option>
        </select>
        <select
          className={styles.classic}
          value={this.state.timeofday}
          onChange={this.handleChangeTimeofday}
        >
          <option selected value="">
            Timeofday
          </option>
          <option value="daytime">daytime</option>
          <option value="night">night</option>
          <option value="dawn/dusk">dawn/dusk</option>
          <option value="undefined">undefined</option>
        </select>
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
        ボックス:
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
        <div>
          {this.props.images.map((image) => {
            return (
              <div className={styles.block}>
                <span className={styles.inline}>{this.props.weather} {this.props.scene} {this.props.timeofday}</span>
                <ImageView
                  // onClick={() => this.props.changeCount()}
                  imageName={image}
                ></ImageView>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    count: state.count,
    images: state.images,
    weather: state.weather,
    scene: state.scene,
    timeofday: state.timeofday,
  };
};

export default connect(mapStateToProps)(CompareView);
