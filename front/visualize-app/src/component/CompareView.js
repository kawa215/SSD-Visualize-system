/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./CompareView.module.css";
import { connect } from "react-redux";
import ImageSelected from "./ImageSelected";
import { changeCount, changeImage } from "../store/index";
import Sample from "./sample.png";

// var newfilterFlags = [];
// for (var i = 0; i < this.props.target_images.length; i++) {
//   newfilterFlags[i] = false;
// }
// console.log(newfilterFlags);
function table(a, b) {
  // console.log("tableきたちょ！！！！！！！！！！！！");
  // console.log(a);
  // console.log(b);
  var tbl = new Array(a.length);
  // console.log(tbl);
  for (let y = 0; y < a.length; y++) {
    // console.log("------x---------------");
    if (b[y] !== null) {
      // for (let g = 0; g < b[y].length; g++) {
      // console.log(b[y]);

      tbl[y] = new Array(b[y].length);
      // console.log(tbl[y]);
      // console.log("------y------");
      for (let w = 0; w < b[y].length; w++) {
        tbl[y][w] = true;
      }
      // console.log(tbl[y]);
    } else {
      tbl[y] = null;
    }
    // }
  }
  // console.log(tbl);
  return tbl;
}

// 二次元配列をコピーする
function copyMatrix(base) {
  const result = [];
  console.log(base);
  if (base.filter(Boolean).length) {
    for (var i = 0; i < base.length; i++) {
      console.log(base[i]);
      if (!base[i]) {
        result[i] = base[i];
      } else {
        result.push([...base[i]]);
      }
    }

    // for (const line of base) {
    //   if(line === undefined){
    //     result[]
    //   }
    //   result.push([...line]);
    // }
  }
  console.log("二次元配列コピ＾の結果");
  console.log(result);
  return result;
}
class CompareView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radio: [false, false, false, false],
      select: [],
      test: [1, 1, 1],
      conditions: new Array(7),
      // inFactorisActive: table(
      //   this.props.target_images,
      //   this.props.factor_images
      // ),
      // inTargetisActive: new Array(this.props.target_images.length).fill(true),
      // filterFlags: new Array(this.props.target_images.length).fill(false),
      inTargetisActive: new Array(this.props.target_images.length).fill(true),
      inFactorisActive: table(
        this.props.target_images,
        this.props.factor_images
      ),
      // filterFlags: new Array(this.props.target_images.length).fill(false),
      // FactorFlags: false,
    };

    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.getNoSameValueArray = this.getNoSameValueArray.bind(this);
    this.returnMapConditions = this.returnMapConditions.bind(this);
    // this.displayConditions = this.displayConditions.bind(this);
    this.addCondition = this.addCondition.bind(this);
    this.handleClickFilter = this.handleClickFilter.bind(this);
    this.displayTest = this.displayTest.bind(this);
    this.array_equal = this.array_equal.bind(this);
    this.inFactorisActive = this.inFactorisActive.bind(this);
    this.inLineisActive = this.inLineisActive.bind(this);
  }

  componentDidUpdate(prevProps) {
    // if (!this.array_equal(this.props.target_images, prevProps.target_images)) {
    if (
      JSON.stringify(prevProps.target_images) !==
        JSON.stringify(this.props.target_images) ||
      JSON.stringify(prevProps.factor_images) !==
        JSON.stringify(this.props.factor_images)
    ) {
      console.log("componetDidUpdate");
      var newTable = table(this.props.target_images, this.props.factor_images);
      var newTarget = new Array(this.props.target_images.length).fill(true);
      //trueで形作り
      // this.setState({
      //   inFactorisActive: newTable,
      //   inTargetisActive: newTarget,
      // });
      //check
      this.displayTest(this.state.conditions, newTarget, newTable, false, 0, 0);
      // var newfilterFlags = [];
      // for (var i = 0; i < this.props.target_images.length; i++) {
      //   newfilterFlags[i] = false;
      // }
      // console.log(newfilterFlags);
      // this.setState({
      //   filterFlags: newfilterFlags,
      //   FactorFlags: [],
      // });
    }
  }

  array_equal(a, b) {
    const ans = a.some((item1) => {
      return b.some(
        (item2) =>
          item1.box !== item2.box &&
          item1.boxImageURL !== item2.boxImageURL &&
          item1.detectAllURL !== item2.detectAllURL &&
          item1.grImageURL !== item2.grImageURL &&
          item1.model !== item2.model &&
          item1.name !== item2.name &&
          item1.scene !== item2.scene &&
          item1.timeofday !== item2.timeofday &&
          item1.weather !== item2.weather
      );
    });
    return ans;
  }

  handleChangeRadio(value) {
    // console.log("--handleChangeRadio---------");
    this.setState({ detect: value });
    if (value === "すべて") {
      this.setState({
        radio: [true, false, false, false],
      });
    } else {
      if (value === "正検出") {
        this.setState({
          radio: [false, true, false, false],
        });
      } else if (value === "誤検出") {
        this.setState({
          radio: [false, false, true, false],
        });
      } else if (value === "誤分類") {
        this.setState({
          radio: [false, false, false, true],
        });
      }
    }
  }

  handleChangeSelect(event, swi) {
    // console.log(event.target.value);
    const value = event.target.value;
    var copySelect = [...this.state.select];
    // console.log(copySelect);
    // console.log(swi)
    // console.log(copySelect[0])
    // copySelect[0] = test;
    copySelect[swi] = value;
    this.setState({ select: copySelect });
    if (value !== "") {
      if (swi === 4) this.handleChangeRadio(value);
      this.addCondition(swi, value);
    }
  }

  getNoSameValueArray(array, value) {
    var copyArray = [...array];
    copyArray.push(value);
    // console.log(copyArray);
    var sArray = new Set(copyArray);
    //重複なしtrue
    if (sArray.size === copyArray.length) {
      // console.log([...copyArray]);
      return [...copyArray];
    } else {
      return [...array];
    }
  }

  addCondition(ind, val) {
    var copyConditions = this.state.conditions;
    // console.log(this.state.conditions[0]);
    if (this.state.conditions[ind] === undefined) {
      if (ind !== 4) {
        val = [val];
      }
      copyConditions[ind] = val;
      this.setState({ conditions: copyConditions });
    } else {
      if (ind !== 4) {
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

    this.displayTest(
      copyConditions,
      this.state.inTargetisActive,
      this.state.inFactorisActive,
      false,
      false,
      0
    );
    //------------++
  }

  returnMapConditions(array, ind) {
    var listConditions;
    const style = [
      styles.model,
      styles.weatherCondition,
      styles.sceneCondition,
      styles.timeofdayCondition,
      styles.detect,
      styles.visualization,
      styles.class,
    ];
    if (Array.isArray(array)) {
      // console.log(array);
      listConditions = array.map((el, elInd) => {
        // console.log("map入ってる");
        // console.log(elInd);
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
    } else if (ind === 4) {
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

  displayTest(
    conditions,
    inTargetisActive,
    inFactorisActive,
    check,
    indexTarget,
    indexFactor
  ) {
    // this.setState({
    //   inFactorisActive: table(
    //     this.props.target_images,
    //     this.props.factor_images
    //   ),
    //   // inTargetisActive: new Array(this.props.target_images.length).fill(true),
    // });
    var copyinFactorisActive = copyMatrix(inFactorisActive);
    var copyinTargetisActive = [...inTargetisActive];

    console.log(copyinFactorisActive);
    console.log(copyinTargetisActive);
    for (var t = 0; t < this.props.target_images.length; t++) {
      var target_condition = [
        this.props.target_images[t].model,
        this.props.target_images[t].weather,
        this.props.target_images[t].scene,
        this.props.target_images[t].timeofday,
      ];

      var boo = [false, false, false, false];
      var ans = false;
      //からの条件はtrue
      for (var i = 0; i < 4; i++) {
        // console.log("checkemmpyに渡す");
        // console.log(conditions);
        boo[i] = this.checkEmpty(conditions[i]);
        // console.log("checkempty:i=" + i);
        // console.log(boo[i]);
        if (!boo[i]) {
          //からじゃない -1　⇨0
          boo[i] = Boolean(conditions[i].indexOf(target_condition[i]) + 1);
        }
      }
      ans = boo[0] && boo[1] && boo[2] && boo[3];
      // console.log("ans=");
      // console.log(ans);
      copyinTargetisActive[t] = ans;
      // return ans;

      //factorもチェック

      // console.log("factorの方です");
      if (this.props.factor_images[t] !== null) {
        for (var r = 0; r < this.props.factor_images[t].length; r++) {
          switch (this.props.factor_images[t][r].detect) {
            // case "all":
            //   factor_image.detect = this.state.conditions[4];
            //   break;
            case "correct":
              this.props.factor_images[t][r].detect = "正検出";
              break;
            case "misdetect":
              this.props.factor_images[t][r].detect = "誤検出";
              break;
            default:
            // console.log(`Sorry, we are out of ${expr}.`);
          }

          // if (this.state.conditions[4] === "すべて") {
          //   var saveFactorImageDetect  =  factor_image.detect;
          //   factor_image.detect = this.state.conditions[4];
          // }
          var factor_condition = [
            this.props.factor_images[t][r].detect,
            this.props.factor_images[t][r].method,
            this.props.factor_images[t][r].clas,
          ];

          // console.log(factor_condition);

          var boo2 = [false, false, false];
          var ans2 = false;
          //からの条件はtrue
          //そもそも6つ繋げなkとそれは必要ない
          for (var u = 4; u < 7; u++) {
            boo2[u - 4] = this.checkEmpty(conditions[u]);
            // console.log("checkempty:i=" + u);
            // console.log(boo[u - 4]);
            if (!boo2[u - 4]) {
              //からじゃない -1　⇨0
              if (Array.isArray(conditions[u])) {
                boo2[u - 4] = Boolean(
                  conditions[u].indexOf(factor_condition[u - 4]) + 1
                );
              } else {
                //radio
                if (conditions[u] === "すべて") {
                  boo2[u - 4] = true;
                  continue;
                }
                if (conditions[u] === factor_condition[u - 4]) {
                  boo2[u - 4] = true;
                } else {
                  boo2[u - 4] = false;
                }
              }
              // boo[i - 3] = Boolean(
              //   this.state.conditions[i].indexOf(factor_condition[i - 3]) + 1
              // );
            }
          }
          ans2 = boo2[0] && boo2[1] && boo2[2];
          // console.log("ans2=");
          // console.log(ans2);
          copyinFactorisActive[t][r] = ans2;
        }
      }
    }

    //要因マップみたい時
    var checkFactorCondition = false;
    for (var h = 4; h < 7; h++) {
      if (!this.checkEmpty(conditions[h])) {
        checkFactorCondition = true;
        break;
      }
    }
    // factor　からのものを見つける　or全部表示されないやつを見つける
    if (checkFactorCondition) {
      // var model = new Array(this.props.target_images.length).fill(true);
      for (var n = 0; n < this.props.target_images.length; n++) {
        copyinTargetisActive[n] = true;
        //全部表示されない
        if (this.props.factor_images[n] !== null) {
          for (var a = 0; a < this.props.factor_images[n].length; a++) {
            //一個でも表示されたら
            if (copyinFactorisActive[n][a] === true) {
              copyinTargetisActive[n] = true;
              break;
            } else {
              copyinTargetisActive[n] = false;
            }
          }
        } else {
          //空
          copyinTargetisActive[n] = false;
        }
      }
    }

    this.setState({
      inTargetisActive: copyinTargetisActive,
      inFactorisActive: copyinFactorisActive,
    });

    if (check) {
      return copyinFactorisActive[indexTarget][indexFactor];
    }
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
      this.setState({
        radio: [false, false, false,false],
      });
    }
    this.setState({
      select: copySelect,
      conditions: copyConditions,
    });
    this.displayTest(
      copyConditions,
      this.state.inTargetisActive,
      this.state.inFactorisActive,
      false,
      0,
      0
    );
  }

  inLineisActive(target_image) {
    var target_condition = [
      target_image.model,
      target_image.weather,
      target_image.scene,
      target_image.timeofday,
    ];

    var boo = [false, false, false, false];
    var ans = false;
    //からの条件はtrue
    for (var i = 0; i < 4; i++) {
      // console.log("checkemmpyに渡す");
      // console.log(this.state.conditions);
      boo[i] = this.checkEmpty(this.state.conditions[i]);
      // console.log("checkempty:i=" + i);
      // console.log(boo[i]);
      if (!boo[i]) {
        //からじゃない -1　⇨0
        boo[i] = Boolean(
          this.state.conditions[i].indexOf(target_condition[i]) + 1
        );
      }
    }
    ans = boo[0] && boo[1] && boo[2] && boo[3];
    // console.log("ans=");
    // console.log(ans);
    return ans;
  }

  inFactorisActive(factor_image, indexTarget, indexFactor) {
    // console.log("factorの方です");

    console.log("どこがundefined!?!?!?!?");
    console.log(indexTarget);
    console.log(indexFactor);
    // console.log(this.state.inFactorisActive[indexTarget][indexFactor]);
    switch (factor_image.detect) {
      // case "all":
      //   factor_image.detect = this.state.conditions[4];
      //   break;
      case "correct":
        factor_image.detect = "正検出";
        break;
      case "misdetect":
        factor_image.detect = "誤検出";
        break;
      default:
      // console.log(`Sorry, we are out of ${expr}.`);
    }

    // if (this.state.conditions[4] === "すべて") {
    //   var saveFactorImageDetect  =  factor_image.detect;
    //   factor_image.detect = this.state.conditions[4];
    // }
    var factor_condition = [
      factor_image.detect,
      factor_image.method,
      factor_image.clas,
    ];

    console.log(factor_condition);

    var boo = [false, false, false];
    var ans = false;
    //からの条件はtrue
    //そもそも6つ繋げなkとそれは必要ない
    for (var i = 4; i < 7; i++) {
      boo[i - 4] = this.checkEmpty(this.state.conditions[i]);
      // console.log("checkempty:i=" + i);
      // console.log(boo[i - 4]);
      if (!boo[i - 4]) {
        //からじゃない -1　⇨0
        if (Array.isArray(this.state.conditions[i])) {
          boo[i - 4] = Boolean(
            this.state.conditions[i].indexOf(factor_condition[i - 4]) + 1
          );
        } else {
          //radio
          if (this.state.conditions[i] === "すべて") {
            boo[i - 4] = true;
            continue;
          }
          if (this.state.conditions[i] === factor_condition[i - 4]) {
            boo[i - 4] = true;
          } else {
            boo[i - 4] = false;
          }
        }
        // boo[i - 3] = Boolean(
        //   this.state.conditions[i].indexOf(factor_condition[i - 3]) + 1
        // );
      }
    }
    ans = boo[0] && boo[1] && boo[2];
    // console.log("ans=");
    // console.log(ans);

    // factor_image.detect = saveFactorImageDetect;

    //Target表示しなくていい
    // var copyFactorFlags = this.state.FactorFlags;
    // // copyFactorFlags.push(ans);
    // copyFactorFlags = ans;

    // console.log(copyFactorFlags);

    // //最後までチェックしたら
    // if (
    //   copyFactorFlags.length === this.props.factor_images[indexTarget].length
    // ) {
    //   //check
    //   var filterFlag;
    //   if (copyFactorFlags.length > 1) {
    //     for (var i = 0; i < copyFactorFlags.length - 1; i++) {
    //       filterFlag = copyFactorFlags[i] && copyFactorFlags[i + 1];
    //     }
    //   } else if (copyFactorFlags.length === 1) {
    //     filterFlag = copyFactorFlags[0];
    //   }

    //   var copyFilterFlags = this.state.filterFlags;
    //   console.log(copyFilterFlags);
    //   copyFilterFlags[indexTarget] = filterFlag;
    //   this.setState({ filterFlags: copyFilterFlags });
    //   copyFactorFlags = [];
    // }
    // this.setState({ FactorFlags: copyFactorFlags });

    return ans;
  }

  checkEmpty(array) {
    // console.log("checkempty 引数は=");
    // console.log(array);
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
        <form>
          フィルター:
          <select
            className={styles.classic}
            value={this.state.select[0]}
            onChange={(e) => this.handleChangeSelect(e, 0)}
          >
            <option selected value="nonemodel">
              Model
            </option>
            <option value="m0001">model0001</option>
            <option value="m0002">model0002</option>
            <option value="m0003">model0003</option>
          </select>
          <select
            className={styles.classic}
            value={this.state.select[1]}
            onChange={(e) => this.handleChangeSelect(e, 1)}
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
            value={this.state.select[2]}
            onChange={(e) => this.handleChangeSelect(e, 2)}
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
            value={this.state.select[3]}
            onChange={(e) => this.handleChangeSelect(e, 3)}
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
              value="すべて"
              onChange={(e) => this.handleChangeSelect(e, 4)}
              checked={this.state.radio[0]}
            />
            すべて
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="正検出"
              onChange={(e) => this.handleChangeSelect(e, 4)}
              checked={this.state.radio[1]}
            />
            正検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="誤検出"
              onChange={(e) => this.handleChangeSelect(e, 4)}
              checked={this.state.radio[2]}
            />
            誤検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="誤分類"
              onChange={(e) => this.handleChangeSelect(e, 4)}
              checked={this.state.radio[3]}
            />
            誤分類
          </label>
          <select
            className={styles.classic}
            value={this.state.select[5]}
            onChange={(e) => this.handleChangeSelect(e, 5)}
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
            value={this.state.select[6]}
            onChange={(e) => this.handleChangeSelect(e, 6)}
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
            <option value="traffic-light">Traffic light</option>
            <option value="traffic-sign">Traffic sign</option>
            <option value="train">Train</option>
            <option value="truck">Truck</option>
          </select>
        </form>
        {this.state.conditions.map((condition, ind) => {
          return this.returnMapConditions(condition, ind);
        })}
        {this.props.target_images.map((target_image, indexTarget) => {
          return (
            <div>
              {/* {this.inLineisActive(target_image) && ( */}
              {this.state.inTargetisActive[indexTarget] && (
                // this.state.filterFlags[indexTarget] && (
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
                                {/* {this.state.inFactorisActive[indexTarget][
                                  indexFactor
                                ]}  */}
                                {/* {this.state.inFactorisActive[indexTarget][
                                  indexFactor
                                ] && ( */}
                                {/* {this.displayTest(
                                  this.state.conditions,
                                  this.state.inTargetisActive,
                                  this.state.inFactorisActive,
                                  true,
                                  indexTarget,
                                  indexFactor
                                ) && ( */}
                                {this.inFactorisActive(
                                  factor_image,
                                  indexTarget,
                                  indexFactor
                                ) && (
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
