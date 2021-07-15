import React, { Component } from "react";
import ImageDataService from "../services/Image.service";
import styles from "./SelectionData.module.css";
import ImageView from "./ImageView";
import { connect } from "react-redux";
 class SelectionData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: "",
      scene: "",
      timeofday: "",
      radio: "",
      images: [],
      weathers: [],
      scenes: [],
      timeofdays: [],
    };

    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleChangeWeather = this.handleChangeWeather.bind(this);
    this.handleChangeScene = this.handleChangeScene.bind(this);
    this.handleChangeTimeofday = this.handleChangeTimeofday.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickFilter = this.handleClickFilter.bind(this);
    this.retrieveImagesOnCondition = this.retrieveImagesOnCondition.bind(this);
    this.addCondition = this.addCondition.bind(this);
    this.passImage = this.passImage.bind(this);
  }

  componentDidMount() {
    this.retrieveImages();
  }

  passImage(imageName) {
    const dispatch = this.props.dispatch;
    console.log("pass")
    dispatch({ type: "ADD_IMAGE", payload: imageName });
    dispatch({ type: "CHANGE_RADIO", payload: this.state.radio });
  }

  retrieveImages() {
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

  retrieveImagesOnCondition(cloneWeathers, cloneScenes, cloneTimeofdays) {
    ImageDataService.getVals(cloneWeathers, cloneScenes, cloneTimeofdays)
      .then((response) => {
        this.setState({ images: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
    //条件に合わせて取得
  }

  addCondition(val, swi) {
    console.log("on condition");
    var cloneWeathers;
    var cloneScenes;
    var cloneTimeofdays;
    //配列取り出し
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
    this.retrieveImagesOnCondition(cloneWeathers, cloneScenes, cloneTimeofdays);
  }

  existsSameValue(a) {
    var s = new Set(a);
    return s.size != a.length;
  }

  checkCondition(condition, newelement) {
    //重複チェック
    var cloneCondition = [...condition];
    cloneCondition.push(newelement);
    if (this.existsSameValue(cloneCondition)) return true;
  }

  handleChangeRadio(event) {
    this.setState({ radio: event.target.value });
  }

  handleChangeWeather(event) {
    var val = event.target.value;
    this.setState({ weather: val });

    //重複しないなら末尾に追加
    if (!this.checkCondition(this.state.weathers, val)) {
      this.setState((state) => {
        return { weathers: [...state.weathers, val] };
      });
      this.addCondition(val, 1);
    }
  }

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

  handleClickFilter(swi, e, weather) {
    e.preventDefault();
    const val = weather;
    console.log(val);
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
    }

    this.retrieveImagesOnCondition(cloneWeathers, cloneScenes, cloneTimeofdays);
  }

  // handleSubmit(event) {
  //   alert("A name was submitted: " + this.state.value);
  //   event.preventDefault();
  // }

  render() {
    return (
      <div className={styles.SelectionData}>
        {this.props.count}メタタグ絞り込み:
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
            <option value="party cloudy">party cloudy</option>
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
              value="正検出"
              onChange={this.handleChangeRadio}
            />
            正検出
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="誤検出"
              onChange={this.handleChangeRadio}
            />
            誤検出
          </label>
          <a href="#" onClick={this.handleClick}>
            全ての条件を解除
          </a>
        </div>
        {this.state.images.map((image) => {
          return (
            <ImageView
              onClick={this.passImage(image.name)}
              imageName={image.name}
            ></ImageView>
          );
        })}
        {/* <div>
          {this.state.images.map((image) => {
            return (
              <div>
                {image.name}:{image.attributes.weather}
              </div>
            );
          })}
        </div> */}
        {this.state.radio}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { count: state.count };
};

export default connect(mapStateToProps)(SelectionData);