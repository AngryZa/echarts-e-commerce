<template>
  <div class="com-container">
    地区销售排行
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0, //区域缩放的起点值  
      endValue: 9, //区域所发的终点至 默认设置就设置成展示10条数据
      timerId:null //定时器的标识
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.initCharts();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    //在界面加载完成的时候主动进行适配
    this.screenAdapter();
    
  },
  methods: {
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      const initOption = {
        title: {
          text: "| 地区销售排行",
          left: 20,
          top: 20,
        },
        tooltip: {
          //工具提示
          show: true,
        },
        grid: {
          // 坐标轴设置
          top: "40%",
          left: "5%",
          right: "5%",
          botto: "5%",
          containLabel: true, //是否包含文本
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);

      // 监听鼠标移入移出时，定时器的关闭和启动
      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout',()=>{
        this.startInterval()
      })

    },
    async getData() {
      //获取服务器的数据，对this.allData进行赋值后，调用updateChart方法更新图表
      const { data } = await this.$http.get("rank");
      this.allData = data;
      // 对数据进行排序操作
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];

      //处理图表需要的数据
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      const dataArr = this.allData.map((item) => {
        return item.value;
      });
      console.log(provinceArr, dataArr);
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          // show: true, //隐藏dataZoom
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: dataArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;

                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize=this.$refs.rank_ref.offsetWidth/100 *3.6
     
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        series:[  
          {
            barWidth:titleFontSize,  //柱的宽度
            itemStyle:{
              barBorderRadius:[titleFontSize/2,titleFontSize/2,0,0]  /* 柱的圆角 */
            }
          }
        ]

      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if(this.timerId){
        clearInterval(this.timerId)
      }
      this.timerId= setInterval(() => {
        this.startValue++;
        this.endValue++;
        if(this.endValue>this.allData.length-1){
          this.startValue=0,
          this.endValue=9
        }
        this.updateChart()
      }, 1000);
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId)


  },
};
</script>
<style lang="scss" scoped>
</style>