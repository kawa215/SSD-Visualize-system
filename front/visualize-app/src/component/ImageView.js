import React, { Component } from "react";
import useState from 'react';
import styles from "./ImageView.module.css";
// import singer_default_img from "./val/" + this.props.imageName;
// const requestImageFile = require.context('./val', true, /.jpg$/);
// const images = require.context('../../public/images', true);
export default class ImageView extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const image = require('./val/' + this.props.imageName);
    return (
      //   <div className={styles.ImageView}>
      <div className={styles.ImageView}>
         {/* <img class="ui medium rounded image"  src={singer_default_img}></img> */}
        {/* <img class="ui medium rounded image" src={"./val/" + this.props.imageName}></img> */}
        {/* <img class="ui medium rounded image" src={requestImageFile(`./`+ this.props.imageName)}></img> */}
        {/* <img class="ui medium rounded image"  src={singer_default_img}></img> */}
        {/* {this.props.imageName} */}
        {/* {"./val/" + this.props.imageName} */}
        <img class="ui medium rounded image" src={"https://placehold.jp/150x150.png"}></img>
      </div>
    );
  }
}
