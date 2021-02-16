import React, { Component } from "react";
import styles from "./SelectionData.module.css";

export default class SelectionData extends Component {
  constructor(props) {
    super(props);
    this.state = { radio: [{ right: "" }, { wrong: "" }] };

    this.handleChangeRight = this.handleChangeRight.bind(this);
    this.handleChangeWrong = this.handleChangeWrong.bind(this);
  }

  handleChangeRight(event) {
    this.setState({ radio, right: event.target.value });
  }

  handleChangeWrong(event) {
    this.setState({ radio, wrong: event.target.value });
  }

  // handleSubmit(event) {
  //   alert("A name was submitted: " + this.state.value);
  //   event.preventDefault();
  // }

  render() {
    return (
      <div className={styles.SelectionData}>
        メタタグ絞り込み
        <select>
          <option selected value>
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
        <select>
          <option selected value>
            Scene
          </option>
          <option value="tunnel">tunnel</option>
          <option value="residential<">residential</option>
          <option value="parking lot">parking lot</option>
          <option value="undefined">undefined</option>
          <option value="city street">city street</option>
          <option value="gas stations">gas stations</option>
          <option value="highway">highway</option>
        </select>
        <select>
          <option selected value>
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
            value={this.state.radio.right}
            onChange={handleChangeRight}
          />
          正検出
        </label>
        <label>
          <input
            type="radio"
            value={this.state.radio.wrong}
            onChange={handleChangeWrong}
          />
          誤検出
        </label>
      </div>
    );
  }
}
