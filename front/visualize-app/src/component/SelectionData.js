import React, { Component } from "react";
import styles from "./SelectionData.module.css";

export default class SelectionData extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className={styles.SelectionData}>
      メタタグ絞り込み
    </div>;
  }
}
