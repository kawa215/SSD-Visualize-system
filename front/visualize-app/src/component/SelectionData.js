import React, { Component } from "react";
import ImageDataService from "../services/Image.service";
import styles from "./SelectionData.module.css";
import ImageView from "./ImageView";
export default class SelectionData extends Component {
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
    this.retrieveImagesOnCondition = this.retrieveImagesOnCondition.bind(this);
  }

  componentDidMount() {
    this.retrieveImages();
  }

  // onChangeSearchWhether(e) {
  //   const searchWether = e.target.value;
  //   //含まれない
  //   if(whether.indexOf(searchWether) != -1)
  //   {    this.setState((prevState) => ({
  //     whether: [...prevState.whether, searchWether],
  //   }));
  // }

  // }

  retrieveImages() {
    ImageDataService.getAll()
      .then((response) => {
        this.setState({
          images: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveImagesOnCondition(val, swi) {
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
    // const cloneWeathers = [...this.state.weathers];
    // var cloneScenes = [...this.state.scenes];
    // var cloneTimeofdays = [...this.state.timeofdays];
    // console.log(cloneWeathers);
    // this.setState({ test: cloneWeathers });
    // this.setState(
    //   cloneWeathers.map((weather)=>{return {test: [...this.state.test,weather]}})
    // );
    ImageDataService.getVals(cloneWeathers, cloneScenes, cloneTimeofdays)
      .then((response) => {
        this.setState({ images: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
    //条件に合わせて取得
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
      this.retrieveImagesOnCondition(val,1);
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
      this.retrieveImagesOnCondition(val,2);
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
      this.retrieveImagesOnCondition(val,3);
    }
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      weathers: [],
      scenes: [],
      timeofdays: [],
    });
  }

  // handleSubmit(event) {
  //   alert("A name was submitted: " + this.state.value);
  //   event.preventDefault();
  // }

  render() {
    return (
      <div className={styles.SelectionData}>
        メタタグ絞り込み
        <select value={this.state.weather} onChange={this.handleChangeWeather}>
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
        <select value={this.state.scene} onChange={this.handleChangeScene}>
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
        適用済みフィルター
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
        {/* {this.state.images.map((image) => {
          return <ImageView imageName={image.name}></ImageView>;
        })} */}
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
