import React, { Component } from "react";
import styles from "./SelectionData.module.css";

export default class SelectionData extends Component {
  constructor(props) {
    super(props);
    this.state = { radio: "" };

    this.handleChangeRadio = this.handleChangeRadio.bind(this);
  }

  handleChangeRadio(event) {
    this.setState({ radio: event.target.value });
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
            name="detect"
            value="正検出"
            onChange={this.handleChangeRadio}
          />
          正検出
        </label>
        <label>
          <input
            type="radio"
            name="detect"
            value="誤検出"
            onChange={this.handleChangeRadio}
          />
          誤検出
        </label>
        <a
          href="#"
          onclick="console.log('The link was clicked.'); return false"
        >
          全ての条件を解除
        </a>
      </div>
    );
  }
}
