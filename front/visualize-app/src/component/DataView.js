import React, { Component } from "react";
import styles from "./DataView.module.css";
import { connect } from "react-redux";

class DataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      radio: this.props.radio,
      weathers: [],
      scenes: [],
      timeofdays: [],
    };
  }
  render() {
    return (
      <div className={styles.DataView}>{this.state.image}可視化手法選択</div>
    );
  }
}

const mapStateToProps = (state) => {
  return { image: state.image, radio: state.radio };
};

export default connect(mapStateToProps)(DataView);
