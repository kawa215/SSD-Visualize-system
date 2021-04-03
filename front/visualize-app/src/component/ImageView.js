import React, { Component } from "react";
import styles from "./ImageView.module.css";
export default class ImageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.ImageView}>
        <img
          class="ui medium rounded image"
          src={"http://localhost:4000/vals/" + this.props.imageName}
        ></img>
        {this.props.imageName}
      </div>
    );
  }
}
