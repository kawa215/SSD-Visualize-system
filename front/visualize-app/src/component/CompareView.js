/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import styles from "./CompareView.module.css";
import { connect } from "react-redux";
import ImageSelected from "./ImageSelected";

// テーブルの作成
function table(a, b) {
  var tbl = new Array(a.length);
  for (let y = 0; y < a.length; y++) {
    if (b[y] !== null) {
      tbl[y] = new Array(b[y].length);
      for (let w = 0; w < b[y].length; w++) {
        tbl[y][w] = true;
      }
    } else {
      tbl[y] = null;
    }
  }
  return tbl;
}

// 二次配列をコピーする
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
  }
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
      inTargetisActive: new Array(this.props.target_images.length).fill(true),
      inFactorisActive: table(
        this.props.target_images,
        this.props.factor_images
      ),
    };

    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.getNoSameValueArray = this.getNoSameValueArray.bind(this);
    this.returnMapConditions = this.returnMapConditions.bind(this);
    this.addCondition = this.addCondition.bind(this);
    this.handleClickFilter = this.handleClickFilter.bind(this);
    this.displayCompare = this.displayCompare.bind(this);
    this.array_equal = this.array_equal.bind(this);
    this.inFactorisActive = this.inFactorisActive.bind(this);
    this.inLineisActive = this.inLineisActive.bind(this);
  }

  // コンポーネント更新された時
  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.target_images) !==
        JSON.stringify(this.props.target_images) ||
      JSON.stringify(prevProps.factor_images) !==
        JSON.stringify(this.props.factor_images)
    ) {
      var newTable = table(this.props.target_images, this.props.factor_images);
      var newTarget = new Array(this.props.target_images.length).fill(true);
      this.displayCompare(this.state.conditions, newTarget, newTable, false, 0, 0);
    }
  }

  // 配列が等しい時
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

  // raidoボタンが変更された時
  handleChangeRadio(value) {
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

  // フィルター条件が変更された時
  handleChangeSelect(event, swi) {
    const value = event.target.value;
    var copySelect = [...this.state.select];
    copySelect[swi] = value;
    this.setState({ select: copySelect });
    if (value !== "") {
      if (swi === 4) this.handleChangeRadio(value);
      this.addCondition(swi, value);
    }
  }

  // 配列から重複を削除する関数
  getNoSameValueArray(array, value) {
    var copyArray = [...array];
    copyArray.push(value);
    var sArray = new Set(copyArray);
    if (sArray.size === copyArray.length) {
      return [...copyArray];
    } else {
      return [...array];
    }
  }

  // フィルター条件を追加
  addCondition(ind, val) {
    var copyConditions = this.state.conditions;
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

    this.displayCompare(
      copyConditions,
      this.state.inTargetisActive,
      this.state.inFactorisActive,
      false,
      false,
      0
    );
  }

  // フィルター条件を表示
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
      listConditions = array.map((el, elInd) => {
        return (
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

  // 追加した画像の比較表示
  displayCompare(
    conditions,
    inTargetisActive,
    inFactorisActive,
    check,
    indexTarget,
    indexFactor
  ) {
    var copyinFactorisActive = copyMatrix(inFactorisActive);
    var copyinTargetisActive = [...inTargetisActive];
    for (var t = 0; t < this.props.target_images.length; t++) {
      var target_condition = [
        this.props.target_images[t].model,
        this.props.target_images[t].weather,
        this.props.target_images[t].scene,
        this.props.target_images[t].timeofday,
      ];

      var boo = [false, false, false, false];
      var ans = false;
      for (var i = 0; i < 4; i++) {
        boo[i] = this.checkEmpty(conditions[i]);
        if (!boo[i]) {
          boo[i] = Boolean(conditions[i].indexOf(target_condition[i]) + 1);
        }
      }
      ans = boo[0] && boo[1] && boo[2] && boo[3];
      copyinTargetisActive[t] = ans;
      if (this.props.factor_images[t] !== null) {
        for (var r = 0; r < this.props.factor_images[t].length; r++) {
          switch (this.props.factor_images[t][r].detect) {
            case "correct":
              this.props.factor_images[t][r].detect = "正検出";
              break;
            case "misdetect":
              this.props.factor_images[t][r].detect = "誤検出";
              break;
            default:
          }
          var factor_condition = [
            this.props.factor_images[t][r].detect,
            this.props.factor_images[t][r].method,
            this.props.factor_images[t][r].clas,
          ];
          var boo2 = [false, false, false];
          var ans2 = false;
          for (var u = 4; u < 7; u++) {
            boo2[u - 4] = this.checkEmpty(conditions[u]);
            if (!boo2[u - 4]) {
              if (Array.isArray(conditions[u])) {
                boo2[u - 4] = Boolean(
                  conditions[u].indexOf(factor_condition[u - 4]) + 1
                );
              } else {
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
            }
          }
          ans2 = boo2[0] && boo2[1] && boo2[2];
          copyinFactorisActive[t][r] = ans2;
        }
      }
    }

    var checkFactorCondition = false;
    for (var h = 4; h < 7; h++) {
      if (!this.checkEmpty(conditions[h])) {
        checkFactorCondition = true;
        break;
      }
    }
    if (checkFactorCondition) {
      for (var n = 0; n < this.props.target_images.length; n++) {
        copyinTargetisActive[n] = true;
        if (this.props.factor_images[n] !== null) {
          for (var a = 0; a < this.props.factor_images[n].length; a++) {
            if (copyinFactorisActive[n][a] === true) {
              copyinTargetisActive[n] = true;
              break;
            } else {
              copyinTargetisActive[n] = false;
            }
          }
        } else {
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

  // 条件のリセット
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

  // フィルター 重複チェック　削除
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
        radio: [false, false, false, false],
      });
    }
    this.setState({
      select: copySelect,
      conditions: copyConditions,
    });
    this.displayCompare(
      copyConditions,
      this.state.inTargetisActive,
      this.state.inFactorisActive,
      false,
      0,
      0
    );
  }

  // 条件によって対象画像を表示 非表示
  inLineisActive(target_image) {
    var target_condition = [
      target_image.model,
      target_image.weather,
      target_image.scene,
      target_image.timeofday,
    ];

    var boo = [false, false, false, false];
    var ans = false;    for (var i = 0; i < 4; i++) {
      boo[i] = this.checkEmpty(this.state.conditions[i]);
      if (!boo[i]) {
        boo[i] = Boolean(
          this.state.conditions[i].indexOf(target_condition[i]) + 1
        );
      }
    }
    ans = boo[0] && boo[1] && boo[2] && boo[3];
    return ans;
  }

  // 条件によって要因マップ画像を表示 非表示
  inFactorisActive(factor_image, indexTarget, indexFactor) {
    switch (factor_image.detect) {
      case "correct":
        factor_image.detect = "正検出";
        break;
      case "misdetect":
        factor_image.detect = "誤検出";
        break;
      default:
    }
    var factor_condition = [
      factor_image.detect,
      factor_image.method,
      factor_image.clas,
    ];
    var boo = [false, false, false];
    var ans = false;
    for (var i = 4; i < 7; i++) {
      boo[i - 4] = this.checkEmpty(this.state.conditions[i]);
      if (!boo[i - 4]) {
        if (Array.isArray(this.state.conditions[i])) {
          boo[i - 4] = Boolean(
            this.state.conditions[i].indexOf(factor_condition[i - 4]) + 1
          );
        } else {
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
      }
    }
    ans = boo[0] && boo[1] && boo[2];
    return ans;
  }

  // 配列が空かチェックする関数
  checkEmpty(array) {
    if (Array.isArray(array)) {
      if (array.length === 0 || array === undefined) return true;
      else return false;
    }
    if (array === undefined || array === null) return true;
    else return false;
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
              {this.state.inTargetisActive[indexTarget] && (
                <div className={styles.block}>
                  <span className={styles.imageRow}>
                    <div className={styles.inlineImg}>
                      <ImageSelected
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