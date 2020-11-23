/* 商家销量统计的横向柱状图 */
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      currentPage: 1,
      totalPage: 0,
      timeId: null, //定时器标识
    };
  },
  watch: {},
  mounted() {
    this.initCharts();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    //在界面加载完成的时候主动进行适配
    this.screenAdapter();
    /* window.addEventListener('keypress',(i)=>{
      console.log(i,'i')
    }) */
  },
  computed: {},
  methods: {
    //初始化echartsInstance对象
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: "▍商家销售统计",
          /* textStyle: {
            fontSize: 44,
          }, */
          top: 20,
          left: "12%",
        },
        grid: {
          top: "9%",
          left: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          // data: sellerNames,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              // width: 66,
              color: "#2D34443",
            },
          },
        },
        series: [
          {
            type: "bar",
            // data: sellerValue,
            // barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              // barBorderRadius: [0, 33, 33, 0],
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#5052EE",
                  },
                  {
                    offset: 1,
                    color: "#AB6EE5",
                  },
                ],
                globalCoord: false,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timeId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    // 获取服务器数据
    async getData() {
      //http://192.168.1.2:8999//api/seller
      //解构赋值
      const { data: ret } = await this.$http.get("seller");
      // console.log(ret, "ret");
      // sort 对数组的元素排序
      ret.sort((a, b) => {
        return a.value - b.value;
      });
      this.allData = ret;

      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;

      this.updateChart();
      //启动定时器
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      // console.log(showData, "showdata");
      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValue = showData.map((item) => {
        return item.value;
      });
      const option = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    startInterval() {
      if (this.timeId) {
        clearInterval(this.timeId);
      }
      this.timeId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // console.log(this.$refs.seller_ref.offsetWidth);
      const adaperOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adaperOption);
      // 手动的调用图表的resize方法，完成图表的适配
      this.chartInstance.resize();
    },


  },
  created() {},
  destroyed() {
    clearInterval(this.timeId);
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>
<style lang="scss" scoped>
</style>