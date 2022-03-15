import React, { Component } from "react";
import ImageDataService from "../services/Image.service";
import styles from "./SelectionData.module.css";
import ImageView from "./ImageView";
import { connect } from "react-redux";
import { changeModel, changeImage } from "../store/index";
import imageDataService from "../services/Image.service";
class SelectionData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: "",
      weather: "",
      scene: "",
      timeofday: "",
      radio: "",
      images: [],
      imagesWithGroundtruth: [],
      weathers: [],
      scenes: [],
      timeofdays: [],
      count: this.props.count,
    };

    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleChangeModel = this.handleChangeModel.bind(this);
    this.handleChangeWeather = this.handleChangeWeather.bind(this);
    this.handleChangeScene = this.handleChangeScene.bind(this);
    this.handleChangeTimeofday = this.handleChangeTimeofday.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickFilter = this.handleClickFilter.bind(this);
    this.retrieveImagesOnCondition = this.retrieveImagesOnCondition.bind(this);
    this.addCondition = this.addCondition.bind(this);
    this.getALLdetectImageList = this.getALLdetectImageList.bind(this);
  }

  // 条件に合う画像を取得 or 無条件で画像をいくつか取得
  retrieveImages(model) {
    if (
      this.state.radio ||
      this.state.weathers.length ||
      this.state.scenes.length ||
      this.state.timeofdays.length
    ) {
      this.retrieveImagesOnCondition(
        this.state.weathers,
        this.state.scenes,
        this.state.timeofdays,
        this.state.radio,
        model
      );
    } else {
      ImageDataService.getAll()
        .then((response) => {
          console.log(response.data);

          this.setState({
            images: response.data,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  // 条件で画像を取得
  retrieveImagesOnCondition(
    cloneWeathers,
    cloneScenes,
    cloneTimeofdays,
    radio,
    model
  ) {
    if (cloneWeathers.length || cloneScenes.length || cloneTimeofdays.length) {
      ImageDataService.getVals(cloneWeathers, cloneScenes, cloneTimeofdays)
        .then((response) => {
          if (this.state.radio !== "all" && this.state.radio !== "") {
            const data = response.data;
            const dataName = data.map((data) => {
              return data.name;
            });
            ImageDataService.getDetectSelectedImageList(model, radio, dataName)
              .then((response) => {
                const datajpg = response.data.map((data) => {
                  return data + ".jpg";
                });
                const images = data.filter((dat) => datajpg.includes(dat.name));
                this.setState({
                  images: images,
                });
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            this.setState({ images: response.data });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (radio !== "") {
        this.getALLdetectImageList(model, radio);
      } else {
        this.retrieveImages(model);
      }
    }
  }

  // 条件追加
  addCondition(val, swi) {
    if (this.state.model) {
      var cloneWeathers;
      var cloneScenes;
      var cloneTimeofdays;
      // eslint-disable-next-line default-case
      switch (swi) {
        case 1:
          cloneWeathers = [...this.state.weathers, val];
          cloneScenes = [...this.state.scenes];
          cloneTimeofdays = [...this.state.timeofdays];
          break;
        case 2:
          cloneWeathers = [...this.state.weathers];
          cloneScenes = [...this.state.scenes, val];
          cloneTimeofdays = [...this.state.timeofdays];
          break;
        case 3:
          cloneWeathers = [...this.state.weathers];
          cloneScenes = [...this.state.scenes];
          cloneTimeofdays = [...this.state.timeofdays, val];
          break;
      }
      this.retrieveImagesOnCondition(
        cloneWeathers,
        cloneScenes,
        cloneTimeofdays,
        this.state.radio,
        this.state.model
      );
    }
  }

  // 重複チェック
  existsSameValue(a) {
    var s = new Set(a);
    return s.size != a.length;
  }

  // 条件の重複チェック
  checkCondition(condition, newelement) {
    var cloneCondition = [...condition];
    cloneCondition.push(newelement);
    if (this.existsSameValue(cloneCondition)) return true;
  }

  // radioボタン変更された時
  handleChangeRadio(event) {
    this.setState({ radio: event.target.value });
    if (this.state.model) {
      this.retrieveImagesOnCondition(
        this.state.weathers,
        this.state.scenes,
        this.state.timeofdays,
        event.target.value,
        this.state.model
      );
    }
  }

  // モデルと検出パターンを指定　データセットを絞る
  getALLdetectImageList(model, sortOfDetect) {
    imageDataService
      .getALLdetectImageList(model, sortOfDetect)
      .then((response) => {
        const data = response.data;
        const dataJpg = data.map((data) => {
          return data.name + ".jpg";
        });
        imageDataService
          .postgetConditionByImagesName(dataJpg)
          .then((response) => {
            this.setState({
              images: response.data,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // 天気が変更された時
  handleChangeWeather(event) {
    var val = event.target.value;
    this.setState({ weather: val });
    if (!this.checkCondition(this.state.weathers, val)) {
      this.setState((state) => {
        return { weathers: [...state.weathers, val] };
      });
      this.addCondition(val, 1);
    }
  }

  // モデルが変更された時
  handleChangeModel(event) {
    var val = event.target.value;
    this.setState({ model: val });
    this.props.changeModel(val);
    this.retrieveImages(val);
  }

  // 場所が変更された時
  handleChangeScene(event) {
    var val = event.target.value;
    this.setState({ scene: val });

    //重複しないなら末尾に追加
    if (!this.checkCondition(this.state.scenes, val)) {
      this.setState({
        scenes: [...this.state.scenes, val],
      });
      this.addCondition(val, 2);
    }
  }

  // 時間が変更されて時
  handleChangeTimeofday(event) {
    var val = event.target.value;
    this.setState({ timeofday: val });

    //重複しないなら末尾に追加
    if (!this.checkCondition(this.state.timeofdays, val)) {
      this.setState({
        timeofdays: [...this.state.timeofdays, val],
      });
      this.addCondition(val, 3);
    }
  }

  // 条件リセット
  handleClick(e) {
    e.preventDefault();
    this.setState({
      model: "",
      weather: "",
      scene: "",
      timeofday: "",
      radio: "",
      images: [],
      imagesWithGroundtruth: [],
      weathers: [],
      scenes: [],
      timeofdays: [],
    });
  }

  // 条件の重複チェックや追加
  handleClickFilter(swi, e, weather) {
    e.preventDefault();
    const val = weather;
    var ind;
    var cloneWeathers = [...this.state.weathers];
    var cloneScenes = [...this.state.scenes];
    var cloneTimeofdays = [...this.state.timeofdays];

    switch (swi) {
      case 1:
        ind = this.state.weathers.indexOf(val);
        console.log(ind);
        if (ind >= 0) {
          this.state.weathers.splice(ind, 1);
          cloneWeathers = [...this.state.weathers];
          this.setState({
            weathers: cloneWeathers,
            weather: "",
          });
        }
        break;
      case 2:
        ind = this.state.scenes.indexOf(val);
        if (ind >= 0) {
          this.state.scenes.splice(ind, 1);
          cloneScenes = [...this.state.scenes];
          this.setState({
            scenes: cloneScenes,
            scene: "",
          });
        }
        break;
      case 3:
        ind = this.state.timeofdays.indexOf(val);
        if (ind >= 0) {
          this.state.timeofdays.splice(ind, 1);
          cloneTimeofdays = [...this.state.timeofdays];
          this.setState({
            timeofdays: cloneTimeofdays,
            timeofday: "",
          });
        }
        break;
      default:
        break;
    }

    if (
      (cloneWeathers.length || cloneScenes.length || cloneTimeofdays.length) &&
      this.state.model
    ) {
      this.retrieveImagesOnCondition(
        cloneWeathers,
        cloneScenes,
        cloneTimeofdays,
        this.state.radio,
        this.state.model
      );
    } else if (this.state.model) {
      this.retrieveImages(this.state.model);
    }
  }

  render() {
    const a = this.props.count;
    return (
      <div className={styles.SelectionData}>
        <div>
          モデル選択:
          <select
            className={styles.classic}
            value={this.state.model}
            onChange={this.handleChangeModel}
          >
            <option selected value="nonemodel">
              Model
            </option>
            <option value="m0001">model0001</option>
            <option value="m0002">model0002</option>
            <option value="m0003">model0003</option>
          </select>
        </div>
        メタタグ絞り込み:
        <div>
          <select
            className={styles.classic}
            value={this.state.weather}
            onChange={this.handleChangeWeather}
          >
            <option selected value="">
              Whether
            </option>
            <option value="rainy">rainy</option>
            <option value="snowy">snowy</option>
            <option value="clear">clear</option>
            <option value="overcast">overcast</option>
            <option value="undefined">undefined</option>
            <option value="partly cloudy">partly cloudy</option>
            <option value="foggy">foggy</option>
          </select>
          <select
            className={styles.classic}
            value={this.state.scene}
            onChange={this.handleChangeScene}
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
            value={this.state.timeofday}
            onChange={this.handleChangeTimeofday}
          >
            <option selected value="">
              Timeofday
            </option>
            <option value="daytime">daytime</option>
            <option value="night">night</option>
            <option value="dawn/dusk">dawn/dusk</option>
            <option value="undefined">undefined</option>
          </select>
        </div>
        適用済みフィルター(画像枚数:{this.state.images.length}枚)
        <div>
          {this.state.weathers.map((weather) => {
            return (
              <button className={styles.weather}>
                {weather}
                <span
                  onClick={(e) => this.handleClickFilter(1, e, weather)}
                  value={weather}
                  className={styles.batsu}
                >
                  ×
                </span>
              </button>
            );
          })}
          {this.state.scenes.map((scene) => {
            return (
              <button className={styles.scene}>
                {scene}
                <span
                  onClick={(e) => this.handleClickFilter(2, e, scene)}
                  value={scene}
                  className={styles.batsu}
                >
                  ×
                </span>
              </button>
            );
          })}
          {this.state.timeofdays.map((timeofday) => {
            return (
              <button className={styles.timeofday}>
                {timeofday}
                <span
                  onClick={(e) => this.handleClickFilter(3, e, timeofday)}
                  value={timeofday}
                  className={styles.batsu}
                >
                  ×
                </span>
              </button>
            );
          })}
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="detect"
              value="all"
              onChange={(e) => this.handleChangeRadio(e)}
            />
            すべて
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="correct"
              onChange={(e) => this.handleChangeRadio(e)}
            />
            正検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="misdetect"
              onChange={(e) => this.handleChangeRadio(e)}
            />
            誤検出
          </label>
          <label className={styles.datec}>
            <input
              className={styles.datec}
              type="radio"
              name="detect"
              value="misclass"
              onChange={(e) => this.handleChangeRadio(e)}
              // onChange={this.handleChangeRadio}
            />
            誤分類
          </label>
        </div>
        <div>
          <a href="#" onClick={this.handleClick}>
            全ての条件を解除
          </a>
        </div>
        {this.state.images.map((image) => {
          return (
            <div>
              <ImageView
                model={this.state.model}
                imageName={image.name}
                imageWeather={image.attributes.weather}
                imageScene={image.attributes.scene}
                imageTimeofday={image.attributes.timeofday}
              ></ImageView>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { count: state.count };
};

const mapDispatchToProps = (dispatch) => ({
  changeModel: (model) => dispatch(changeModel(model)),
  changeImage: (name, weather, scene, timeofday) =>
    dispatch(changeImage(name, weather, scene, timeofday)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectionData);
