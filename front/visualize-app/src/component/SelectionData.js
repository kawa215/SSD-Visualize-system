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
    this.passImage = this.passImage.bind(this);
    this.getALLdetectImageList = this.getALLdetectImageList.bind(this);
  }

  // componentDidMount() {
  //   this.retrieveImages();
  // }

  passImage(imageName) {
    const dispatch = this.props.dispatch;
    console.log("pass");
    // dispatch({ type: "ADD_IMAGE", payload: imageName });
    // dispatch({ type: "CHANGE_RADIO", payload: this.state.radio });
  }

  retrieveImages(model) {
    if (this.state.radio || this.state.weathers.length || this.state.scenes.length || this.state.timeofdays.length) {
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

  retrieveImagesOnCondition(
    cloneWeathers,
    cloneScenes,
    cloneTimeofdays,
    radio,
    model
  ) {
    console.log("retrieveImagesOnCondition");
    // radioが変更された時も どれか長さがある時
    if (cloneWeathers.length || cloneScenes.length || cloneTimeofdays.length) {
      ImageDataService.getVals(cloneWeathers, cloneScenes, cloneTimeofdays)
        .then((response) => {
          if (this.state.radio !== "all" && this.state.radio !== "") {
            const data = response.data;
            console.log("resoponse");
            console.log(data);
            // this.setState({ images: response.data });
            const dataName = data.map((data) => {
              return data.name;
            });
            console.log(this.state.model);
            console.log(this.state.radio);
            console.log(dataName);
            ImageDataService.getDetectSelectedImageList(model, radio, dataName)
              .then((response) => {
                //ここから！サーバー側記述
                console.log(response.data);
                const datajpg = response.data.map((data) => {
                  return data + ".jpg";
                });
                //
                console.log(datajpg);
                console.log(data);
                const images = data.filter((dat) => datajpg.includes(dat.name));
                this.setState({
                  images: images,
                });
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            console.log("this.state.radio ! this.state.radio !== ");

            this.setState({ images: response.data });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      //radioのみの時
      if (radio !== "") {
        console.log("this.getALLdetectImageList");
        this.getALLdetectImageList(model, radio);
      } else {
        //radioもない時
        this.retrieveImages(model);
      }
    }
    //条件に合わせて取得
  }

  addCondition(val, swi) {
    console.log("on condition");
    if (this.state.model) {
      var cloneWeathers;
      var cloneScenes;
      var cloneTimeofdays;
      //配列取り出し
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
    if (this.state.model) {
      this.retrieveImagesOnCondition(
        this.state.weathers,
        this.state.scenes,
        this.state.timeofdays,
        event.target.value,
        this.state.model
      );
    }

    // if (event.target.value === "all") {
    //   if (
    //     this.state.weathers.length ||
    //     this.state.scenes.length ||
    //     this.state.timeofdays.length
    //   ) {
    //     this.retrieveImagesOnCondition(
    //       this.state.weathers,
    //       this.state.scenes,
    //       this.state.timeofdays
    //     );
    //   } else {
    //     this.retrieveImages();
    //   }
    // } else {
    //   this.getALLdetectImageList(this.state.model, event.target.value);
    // }

    //
  }

  getALLdetectImageList(model, sortOfDetect) {
    console.log(model);
    console.log(sortOfDetect);
    imageDataService
      .getALLdetectImageList(model, sortOfDetect)
      .then((response) => {
        //画像名
        const data = response.data;
        console.log(data);
        const dataJpg = data.map((data) => {
          return data.name + ".jpg";
        });
        // console.log(dataJpg)
        imageDataService
          .postgetConditionByImagesName(dataJpg)
          .then((response) => {
            console.log(response.data);
            // return {
            //   attributes: response.data,
            //   name: dat,
            // };
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

  handleChangeModel(event) {
    var val = event.target.value;
    // this.handleClick(event);
    this.setState({ model: val });
    this.props.changeModel(val);
    this.retrieveImages(val);
    //重複しないなら末尾に追加
    // if (!this.checkCondition(this.state.model, val)) {
    //   this.setState((state) => {
    //     return { weathers: [...state.weathers, val] };
    //   });
    //   this.addCondition(val, 1);
    // }
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
    // if(this.state.model)this.retrieveImages();
    
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
      default:
        break;
    }

    if (
      (cloneWeathers.length || cloneScenes.length || cloneTimeofdays.length) &&
      this.state.model
    ) {
      console.log(
        "cloneWeathers.length || cloneScenes.length || cloneTimeofdays.length"
      );
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

  // handleSubmit(event) {
  //   alert("A name was submitted: " + this.state.value);
  //   event.preventDefault();
  // }

  render() {
    const a = this.props.count;
    return (
      <div className={styles.SelectionData}>
        {/* <button onClick={() => this.props.changeCount()} title="setName">
          おおおお
        </button>
        count = {this.props.count}/{this.state.count}/{a}
        <br /> */}
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
              // onChange={this.handleChangeRadio}
            />
            すべて
          </label>
          <label>
            <input
              type="radio"
              name="detect"
              value="correct"
              // onChange={this.handleChangeRadio}
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
              // onChange={this.handleChangeRadio}
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
              {/* {" "}
              {image.attributes.weather}aaa */}
              <ImageView
                // onClick={() =>
                //   this.props.changeImage(
                //     image.name,
                //     image.attributes.weather,
                //     image.attributes.scene,
                //     image.attributes.timeofday
                //   )
                // }
                model={this.state.model}
                imageName={image.name}
                imageWeather={image.attributes.weather}
                imageScene={image.attributes.scene}
                imageTimeofday={image.attributes.timeofday}
              ></ImageView>
            </div>
          );
        })}
        {/* {
          <div>
            {this.state.images.map((image) => {
              return (
                <div>
                  {image.name}:{image.attributes.weather}
                </div>
              );
            })}
          </div>
        } */}
        {/* {this.state.radio} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { count: state.count };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     countUp: function (value) {
//       return dispatch(countUp(value));
//     },
//     countDown: function (value) {
//       return dispatch(countDown(value));
//     },
//   };
// };

const mapDispatchToProps = (dispatch) => ({
  changeModel: (model) => dispatch(changeModel(model)),
  changeImage: (name, weather, scene, timeofday) =>
    dispatch(changeImage(name, weather, scene, timeofday)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectionData);
