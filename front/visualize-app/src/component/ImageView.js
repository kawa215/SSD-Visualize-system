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
          src={"http://localhost:4000/vals/" + this.props.imageName}
          // className={styles.img}
          className={styles.img}
        ></img>
        <div >{this.props.imageName}</div>
      </div>
    );
  }
}
