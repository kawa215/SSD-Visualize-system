/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./CompareView.module.css";
import { connect } from "react-redux";
import ImageSelected from "./ImageSelected";
import { changeCount, changeImage } from "../store/index";
import Sample from "./sample.png";

class CompareView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: [],
      test: [1, 1, 1],
      conditions: new Array(6),
    };

    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.getNoSameValueArray = this.getNoSameValueArray.bind(this);
    this.returnMapConditions = this.returnMapConditions.bind(this);
    // this.displayConditions = this.displayConditions.bind(this);
    this.addCondition = this.addCondition.bind(this);
    this.handleClickFilter = this.handleClickFilter.bind(this);
    this.displayTest = this.displayTest.bind(this);
  }

  handleChangeSelect(event, swi) {
    console.log(event.target.value);
    const value = event.target.value;
    var copySelect = [...this.state.select];

    // console.log(copySelect);
    // console.log(swi)
    // console.log(copySelect[0])
    // copySelect[0] = test;
    copySelect[swi] = value;
    this.setState({ select: copySelect });
    if (value !== "") {
      this.addCondition(swi, value);
    }
  }

  getNoSameValueArray(array, value) {
    var copyArray = [...array];
    copyArray.push(value);
    console.log(copyArray);
    var sArray = new Set(copyArray);
    //重複なしtrue
    if (sArray.size === copyArray.length) {
      console.log([...copyArray]);
      return [...copyArray];
    } else {
      return [...array];
    }
  }

  addCondition(ind, val) {
    var copyConditions = this.state.conditions;
    console.log(this.state.conditions[0]);
    if (this.state.conditions[ind] === undefined) {
      if (ind !== 3) {
        val = [val];
      }
      copyConditions[ind] = val;
      this.setState({ conditions: copyConditions });
    } else {
      if (ind !== 3) {
        var newConditions = this.getNoSameValueArray(
          this.state.conditions[ind],
          val
        );
        copyConditions[ind] = newConditions;
      } else {
        copyConditions[ind] = val;
      }
      this.setState({ conditions: copyConditions });
    }
  }

  returnMapConditions(array, ind) {
    var listConditions;
    const style = [
      styles.weatherCondition,
      styles.sceneCondition,
      styles.timeofdayCondition,
      styles.detect,
      styles.visualization,
      styles.class,
    ];
    if (Array.isArray(array)) {
      console.log(array);
      listConditions = array.map((el, elInd) => {
        console.log("map入ってる");
        console.log(elInd);
        return (
          // <div>
          //   <p>This Year is a</p>
          // </div>
          <button className={style[ind]}>
            {el}
            <span
              onClick={(e) => this.handleClickFilter(e, ind, elInd)}
              value={el}
              className={styles.batsuButton}
            >
              ×
            </span>
          </button>
        );
      });
    } else if (ind === 3) {
      listConditions = (
        <span>
          {array && (
            <button className={style[ind]}>
              {array}
              <span
                onClick={(e) => this.handleClickFilter(e, ind, -1)}
                value={array}
                className={styles.batsuButton}
              >
                ×
              </span>
            </button>
          )}
        </span>
      );
    }
    return <span>{listConditions}</span>;
  }

  displayTest() {
    return (
      <div>
        <p>This Year is a</p>
      </div>
    );
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      weathers: [],
      scenes: [],
      timeofdays: [],
      weather: "",
      scene: "",
      timeofday: "",
      images: [],
    });
  }

  handleClickFilter(e, ind, elInd) {
    e.preventDefault();
    var copyConditions = this.state.conditions;
    var copySelect = this.state.select;
    if (elInd !== -1) {
      copyConditions[ind].splice(elInd, 1);
      copySelect[ind] = "";
    } else {
      copyConditions[ind] = null;
      copySelect[ind] = undefined;
    }
    this.setState({
      select: copySelect,
      conditions: copyConditions,
    });
  }

  inLineisActive(target_image) {
    var target_condition = [
      target_image.weather,
      target_image.scene,
      target_image.timeofday,
    ];

    var boo = [false, false, false];
    var ans = false;
    //からの条件はtrue
    for (var i = 0; i < 3; i++) {
      console.log("checkemmpyに渡す");
      console.log(this.state.conditions);
      boo[i] = this.checkEmpty(this.state.conditions[i]);
      console.log("checkempty:i=" + i);
      console.log(boo[i]);
      if (!boo[i]) {
        //からじゃない -1　⇨0
        boo[i] = Boolean(
          this.state.conditions[i].indexOf(target_condition[i]) + 1
        );
      }
    }
    ans = boo[0] && boo[1] && boo[2];
    console.log("ans=");
    console.log(ans);
    return ans;
  }

  inFactorisActive(factor_image) {
    console.log("factorの方です");
    var factor_condition = [
      factor_image.detect,
      factor_image.method,
      factor_image.clas,
    ];

    var boo = [false, false, false];
    var ans = false;
    //からの条件はtrue
    //そもそも6つ繋げなkとそれは必要ない
    for (var i = 3; i < 6; i++) {
      boo[i - 3] = this.checkEmpty(this.state.conditions[i]);
      console.log("checkempty:i=" + i);
      console.log(boo[i - 3]);
      if (!boo[i - 3]) {
        //からじゃない -1　⇨0
        if (Array.isArray(this.state.conditions[i])) {
          boo[i - 3] = Boolean(
            this.state.conditions[i].indexOf(factor_condition[i - 3]) + 1
          );
        } else {
          if (this.state.conditions[i] === factor_condition[i - 3]) {
            boo[i - 3] = true;
          } else {
            boo[i - 3] = false;
          }
        }
        // boo[i - 3] = Boolean(
        //   this.state.conditions[i].indexOf(factor_condition[i - 3]) + 1
        // );
      }
    }
    ans = boo[0] && boo[1] && boo[2];
    console.log("ans=");
    console.log(ans);
    return ans;
  }

  checkEmpty(array) {
    console.log("checkempty 引数は=");
    console.log(array);
    //多分ミスってるからの配列は?undefine?
    // if (typeof array === "string" || array instanceof String) {
    //   //it is string
    //   if (array === undefined) return true;
    //   else return false;
    // } else {
    //   //it is not string
    //   if (array === undefined || array.length === 0) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // if (array === undefined) {
    //   if (Array.isArray(array)) {
    //     if (array.length === 0) return true;
    //     else return false;
    //   }
    //   return true;
    // } else {
    //   if (Array.isArray(array)) {
    //     if (array.length === 0) return true;
    //     else return false;
    //   }else{
    //     return false;
    //   }
    if (Array.isArray(array)) {
      if (array.length === 0 || array === undefined) return true;
      else return false;
    }
    if (array === undefined || array === null) return true;
    else return false;
    // }
  }

  render() {
    return (
      <div className={styles.CompareView}>
        フィルター
        <select
          className={styles.classic}
          value={this.state.select[0]}
          onChange={(e) => this.handleChangeSelect(e, 0)}
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
          value={this.state.select[1]}
          onChange={(e) => this.handleChangeSelect(e, 1)}
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
          value={this.state.select[2]}
          onChange={(e) => this.handleChangeSelect(e, 2)}
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
            value="all"
            checked={this.state.conditions[3] === "all"}
            onChange={(e) => this.handleChangeSelect(e, 3)}
          />
          ALL
        </label>
        <label>
          <input
            type="radio"
            name="detect"
            value="正検出"
            checked={this.state.conditions[3] === "正検出"}
            onChange={(e) => this.handleChangeSelect(e, 3)}
          />
          正検出
        </label>
        <label>
          <input
            type="radio"
            name="detect"
            value="誤検出"
            checked={this.state.conditions[3] === "誤検出"}
            onChange={(e) => this.handleChangeSelect(e, 3)}
          />
          誤検出
        </label>
        <select
          className={styles.classic}
          value={this.state.select[4]}
          onChange={(e) => this.handleChangeSelect(e, 4)}
        >
          <option selected value="">
            Visualization
          </option>
          <option value="ig">Integrated Gradients</option>
          <option value="gradcam">GradCAM</option>
          <option value="deeplift">Deeplift</option>
        </select>
        <select
          className={styles.classic}
          value={this.state.select[5]}
          onChange={(e) => this.handleChangeSelect(e, 5)}
        >
          <option selected value="">
            class
          </option>
          <option value="bike">Bike</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
          <option value="motor">Motor</option>
          <option value="person">Person</option>
          <option value="rider">Rider</option>
          <option value="traffic light">Traffic light</option>
          <option value="traffic sign">Traffic sign</option>
          <option value="train">Train</option>
          <option value="truck">Truck</option>
        </select>
        <br />
        {this.state.conditions.map((condition, ind) => {
          return this.returnMapConditions(condition, ind);
        })}
        {this.props.target_images.map((target_image, indexTarget) => {
          return (
            <div>
              {this.inLineisActive(target_image) && (
                <div className={styles.block}>
                  <span className={styles.imageRow}>
                    <div className={styles.inlineImg}>
                      <ImageSelected
                        // onClick={() => this.props.changeCount()}
                        model={target_image.model}
                        imageName={target_image.name}
                        grURL={target_image.grImageURL}
                        allURL={target_image.detectAllURL}
                        indexTarget={indexTarget}
                        indexFactor={-1}
                        flag="false"
                      ></ImageSelected>

                      <span className={styles.weather}>
                        {target_image.weather}
                      </span>
                      <span className={styles.weather}>
                        {target_image.scene}
                      </span>
                      <span className={styles.weather}>
                        {target_image.timeofday}
                      </span>
                    </div>
                    {this.props.factor_images[indexTarget] !== null && (
                      <div className={styles.factorImgs}>

                        {this.props.factor_images[indexTarget].map(
                          (factor_image, indexFactor) => {
                            return (
                              <span>
                                {this.inFactorisActive(factor_image) && (
                                  <div className={styles.factorImg}>
                                    <ImageSelected
                                      imageName={factor_image.name}
                                      flag="true"
                                      URL={factor_image.visualizedImageURL}
                                      indexTarget={indexTarget}
                                      indexFactor={indexFactor}
                                      viURL={factor_image.visualizedImageURL}
                                      boxURL={factor_image.boxImageURL}
                                      opacity={factor_image.opacity}
                                      scale={factor_image.scale}
                                      style={factor_image.style}
                                      box={factor_image.box}
                                      detect={factor_image.detect}
                                      clas={factor_image.clas}
                                      score={factor_image.score}
                                    ></ImageSelected>
                                    <span className={styles.weather}>
                                      {factor_image.method}　{factor_image.clas}
                                    </span>
                                  </div>
                                )}
                              </span>
                            );
                          }
                        )}
                      </div>
                    )} 
                    {/* //   )}
                      // </span> */}
                    {/* )} */}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    factor_images: state.factor_images,
    target_images: state.target_images,
  };
};

export default connect(mapStateToProps)(CompareView);

// {this.props.factor_images[indexTarget].map(
//   (factor_image, indexFactor) => {
//     return (
//       <span>
//         {/* {this.factorImageisActive(factor_image) && ( */}
//         {this.inFactorisActive(factor_image) && (
//           <div className={styles.factorImg}>
//             <ImageSelected
//               // onClick={() => this.props.changeCount()}
//               imageName={factor_image.name}
//               flag="true"
//               URL={factor_image.visualizedImageURL}
//               indexTarget={indexTarget}
//               indexFactor={indexFactor}
//               viURL={factor_image.visualizedImageURL}
//               boxURL={factor_image.boxImageURL}
//               opacity={factor_image.opacity}
//               scale={factor_image.scale}
//               style={factor_image.style}
//               box={factor_image.box}
//               detect={factor_image.detect}
//               clas={factor_image.clas}
//               score={factor_image.score}
//             ></ImageSelected>
//             <span className={styles.weather}>
//               box{factor_image.box}-{factor_image.detect}-
//               {factor_image.method}- {factor_image.clas}
//             </span>
//           </div>
//         )}
//       </span>
//     );
//   }
// )}
