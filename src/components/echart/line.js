import React, { Component } from 'react';
import echarts from 'echarts';

class LineEchart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // console.log(this.props, '折线图参数');
    this.init();
    // this.screenChange();
  }
  // 监听窗口变化， 但在这里没必要， 因为弹框页面宽度固定
  // screenChange() {
  //   window.addEventListener('resize', this.resize);
  // }
  // resize = () => {};
  init = () => {
    var myChart = echarts.init(this.refs.echartname);
    var lineData = this.props.lineData; //将折线图得知赋值给lineData
    // 绘制图表 配置图标和数据同步更新
    let echartLineData = {
      title: {
        text: lineData.title || '', //标题
        subtext: lineData.subtext || '', //副标题
        left: 'left',
        textStyle: {
          // 字体设置
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let str = '';
          params.forEach((ele, index) => {
            let midStr = '';
            index === 0
              ? (midStr = `${ele.axisValue}<br />${ele.seriesName}: ${
                  ele.value
                }<br />`)
              : (midStr = `${ele.seriesName}: ${ele.value}<br />`);
            str += midStr;
          });
          return str;
        }
      },
      legend: {
        data: ['android', 'ios', 'total']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitNumber: 5,
        data: lineData.xAxisData,
        axisLabel: {
          formatter: function(val) {
            // if (lineData.xAxisData.length < 300) {
            //   return val.slice(5, 19);
            // } else {
            //   return val.slice(5, 10);
            // }
            return val.slice(5, 19);
          }
        }
      },
      yAxis: lineData.yAxis || {
        type: 'value',
        axisLabel: {
          // formatter: '{value} K',
          // formatter: '{value} '
          formatter: function(value, index) {
            if (value < 1000) {
              return value;
            } else if (value >= 1000 && value < 10000000) {
              return (Math.round(value / 10) / 100).toFixed(2) + 'K';
            } else if (value >= 10000000 && value < 10000000000) {
              return (Math.round(value / 100000) / 100).toFixed(2) + 'M';
            } else if (value >= 10000000000) {
              return (Math.round(value / 100000000) / 100).toFixed(2) + 'B';
            }
          }
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          left: 140,
          right: 140,
          handleIcon:
            'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }
      ],
      series: [
        {
          name: 'android',
          type: 'line',
          // areaStyle: {
          //   normal: {
          //     color: 'rgba(115, 169, 98, 0.3)'
          //   }
          // },
          data: lineData.androidData,
          symbol: 'circle',
          showAllSymbol: lineData.androidData.length > 350 ? false : true,
          itemStyle: {
            normal: {
              color: 'rgb(115, 169, 98)', //折线点的颜色
              lineStyle: {
                color: 'rgb(115, 169, 98)' //折线的颜色
              }
            }
          },
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'ios',
          type: 'line',
          // areaStyle: {
          //   normal: {
          //     color: 'rgba(231, 175, 50, 0.3)'
          //   }
          // },
          data: lineData.iosData,
          showAllSymbol: lineData.iosData.length > 350 ? false : true,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgb(231, 175, 50)', //折线点的颜色
              lineStyle: {
                color: 'rgb(231, 175, 50)' //折线的颜色
              }
            }
          },
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'total',
          type: 'line',
          // areaStyle: {
          //   normal: {
          //     color: 'rgba(124, 200, 217, 0.3)'
          //   }
          // },
          data: lineData.totalData,
          showAllSymbol: lineData.totalData.length > 350 ? false : true,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgb(124, 200, 217)', //折线点的颜色
              lineStyle: {
                color: 'rgb(124, 200, 217)' //折线的颜色
              }
            }
          },
          lineStyle: {
            normal: {
              width: 1
            }
          }
        }
      ]
    };
    myChart.setOption(echartLineData, true);
  };
  render() {
    return (
      <div
        id="main"
        style={{ width: '100%', height: '100%' }}
        ref="echartname"
      />
    );
  }
}
export default LineEchart;
