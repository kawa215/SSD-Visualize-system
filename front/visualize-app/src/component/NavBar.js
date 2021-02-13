import React, { Component } from "react";
import styles from "./NavBar.module.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      //   <div className={styles.NavBar}>
      <div className={styles.NavBar}>
        <a href="#top">SSD Explainer</a>
      </div>
    );
  }
}
