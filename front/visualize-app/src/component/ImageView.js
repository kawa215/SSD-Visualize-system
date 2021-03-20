import React, { Component } from "react";
import styles from "./ImageView.module.css";

export default class ImageView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      //   <div className={styles.ImageView}>
      <div className={styles.ImageView}>
        <image></image>
      </div>
    );
  }
}
