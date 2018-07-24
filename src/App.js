import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindAll } from 'lodash';
import Slider from 'rc-slider';
import logo from './logo.svg';
import './App.css';

const defaultColors = ['#fc4144', '#fd9251', '#fed831', '#21ce83', '#2af3fd', '#4476fb', '#983dd0', '#000000', '#ffffff'];
const hueAilStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
  width: '100%',
  height: '10px',
  margin: 'auto',
  borderRadius: '8px'
};
const handleStyle = {
  position: 'absolute',
  marginLeft: '-10px',
  width: '40px',
  height: '40px',
  backgroundColor: '#fff',
  borderRadius: '50%',
  border: 'solid 4px #cfcfcf',
  boxSizing: 'border-box'
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      // 最终RGB中R的值
      R: 255,
      // 最终RGB中G的值
      G: 0,
      // 最终RGB中B的值
      B: 0,
      // Hue对应滑动条的值
      hPickerValue: 0,
      // Saturation对应滑动条的值
      sPickerValue: 100,
      // Brightness对应滑动条的值
      bPickerValue: 100,
      // 最终计算得到rgb的值
      rgbValue: ''
    };
    bindAll(this, [
      'getDefaultColorItems',
      'setDefaultColor',
      'onHueSliderChange',
      'onSatSliderChange',
      'onBriSliderChange'
    ]);
  }
  /**
   *组件加载完毕
   *
   * @memberof App
   */
  componentDidMount() {
    // 设置默认颜色值，可从外部组件传递过来
    const { value } = this.props;
    this.hexToRgb(value || defaultColors[0]);
    this.setState({
      rgbValue: value || defaultColors[0]
    });
  }
  /**
   *获取默认颜色选项
   *
   * @returns
   * @memberof App
   */
  getDefaultColorItems() {
    const { rgbValue } = this.state;
    return defaultColors.map((item, idx) => {
      return (
        <label
          className={classNames("color-item", {
            ["active"]: item === rgbValue
          })}
          key={`default-color-${item}-${idx}`}
          style={{ backgroundColor: item }}
          onClick={this.setDefaultColor.bind(this, item)}
        ></label>
      )
    })
  }
  /**
   *设置默认颜色值
   *
   * @param {*} value
   * @memberof App
   */
  setDefaultColor(value) {
    this.hexToRgb(value);
    this.setState({
      rgbValue: value
    });
  }
  /**
   *Hue滑动条改变
   *
   * @param {*} value
   * @memberof App
   */
  onHueSliderChange(value) {
    const { sPickerValue, bPickerValue } = this.state;
    // 将hsv转换为rgb颜色
    this.hsvToRgb(value / 360, sPickerValue / 100, bPickerValue / 100);
    // 存储状态
    this.setState({
      hPickerValue: value
    });
  }
  /**
   *Sat滑动条改变
   *
   * @param {*} value
   * @memberof App
   */
  onSatSliderChange(value) {
    const { hPickerValue, bPickerValue } = this.state;
    // 将hsv转换为rgb颜色
    this.hsvToRgb(this.state.hPickerValue / 360, value / 100, bPickerValue / 100);
    // 存储状态
    this.setState({
      sPickerValue: value
    });
  }
  /**
   *Bri滑动条改变
   *
   * @param {*} value
   * @memberof App
   */
  onBriSliderChange(value) {
    const { hPickerValue, sPickerValue } = this.state;
    // 将hsv转换为rgb颜色
    this.hsvToRgb(this.state.hPickerValue / 360, sPickerValue / 100, value / 100);
    // 存储状态
    this.setState({
      bPickerValue: value
    });
  }
  /**
   *hsv转换为rgb
   *
   * @param {*} H
   * @param {*} S
   * @param {*} V
   * @memberof App
   */
  hsvToRgb(H, S, V) {
    let R;
    let G;
    let B;
    if (S === 0) {
      R = V;
      G = V;
      B = V;
    } else {
      let _H = H * 6;
      if (_H === 6) {
        _H = 0;
      }
      const i = Math.floor(_H);
      const v1 = V * (1 - S);
      const v2 = V * (1 - (S * (_H - i)));
      const v3 = V * (1 - (S * (1 - (_H - i))));
      if (i === 0) {
        R = V;
        G = v3;
        B = v1;
      } else if (i === 1) {
        R = v2;
        G = V;
        B = v1;
      } else if (i === 2) {
        R = v1;
        G = V;
        B = v3;
      } else if (i === 3) {
        R = v1;
        G = v2;
        B = V;
      } else if (i === 4) {
        R = v3;
        G = v1;
        B = V;
      } else {
        R = V;
        G = v1;
        B = v2;
      }
    }
    this.setState({ R, G, B });
    const rValue = Math.round(R * 255);
    const gValue = Math.round(G * 255);
    const bValue = Math.round(B * 255);
    const colors = [rValue, gValue, bValue];
    this.rgbToHex(colors);
  }
  /**
   *rgb转化为hsb[v]
   *
   * @param {*} r
   * @param {*} g
   * @param {*} b
   * @memberof App
   */
  rgbToHsb(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    let h, s, v;
    const min = Math.min(r, g, b);
    const max = v = Math.max(r, g, b);
    const difference = max - min;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / difference + (g < b ? 6 : 0); break;
        case g: h = 2.0 + (v - r) / difference; break;
        case b: h = 4.0 + (r - g) / difference; break;
      }
      h = Math.round(h * 60);
    }
    if (max == 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }
    s = Math.round(s * 100);
    v = Math.round(v * 100);
    this.setState({
      hPickerValue: h,
      sPickerValue: s,
      bPickerValue: v,
    });
  }
  /**
   *rgb转换为十六进制
   *
   * @param {*} colors
   * @memberof App
   */
  rgbToHex(colors) {
    let hex = '#';
    for (let i = 0; i < 3; i += 1) {
      hex += ("0" + Number(colors[i]).toString(16)).slice(-2);
    }
    this.setState({
      rgbValue: hex
    });
  }
  /**
   *十六进制转换为rgb
   *
   * @param {*} hex
   * @memberof App
   */
  hexToRgb(hex) {
    const color = [];
    const rgb = [];
    const sliderValues = [];
    hex = hex.replace(/#/, "");
    if (hex.length == 3) {
      const tmp = [];
      for (var i = 0; i < 3; i++) {
        tmp.push(hex.charAt(i) + hex.charAt(i));
      }
      hex = tmp.join("");
    }
    for (let i = 0; i < 3; i += 1) {
      color[i] = "0x" + hex.substr(i * 2, 2);
      rgb.push(parseInt(Number(color[i])));
    }
    this.rgbToHsb(rgb[0], rgb[1], rgb[2]);
  }
  render() {
    const { hPickerValue, sPickerValue, bPickerValue, rgbValue } = this.state;
    const { onOk, onHide } = this.props;
    return (
      <section className="content">
        <div className="color-picker">
          <div className="default-color">
            {
              this.getDefaultColorItems()
            }
          </div>
          <div className="picker">
            <div className="slider">
              <Slider
                className="h-slider"
                min={0}
                max={359}
                value={hPickerValue}
                railStyle={hueAilStyle}
                handleStyle={handleStyle}
                onChange={this.onHueSliderChange}
              />
              <Slider
                className="s-slider"
                min={0}
                max={100}
                value={sPickerValue}
                railStyle={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: `linear-gradient(to right, transparent, ${rgbValue})`,
                  width: '100%',
                  height: '10px',
                  margin: 'auto',
                  borderRadius: '8px'
                }}
                handleStyle={handleStyle}
                onChange={this.onSatSliderChange}
              />
              <Slider
                className="b-slider"
                min={0}
                max={100}
                value={bPickerValue}
                railStyle={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: `linear-gradient(to right, #000, ${rgbValue})`,
                  width: '100%',
                  height: '10px',
                  margin: 'auto',
                  borderRadius: '8px'
                }}
                handleStyle={handleStyle}
                onChange={this.onBriSliderChange}
              />
            </div>
            <div
              className="color-value"
              style={{ backgroundColor: rgbValue }}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default App;
