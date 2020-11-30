/* 商家分布图表 */
<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  props: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk');
      //获取中国地图的矢量数-------本地数据
      const req = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      // console.log(req,'res')
      this.$echarts.registerMap("china", req.data);
      const initOption = {
          title:{
              text:"| 商家分布",
              left:20,
              top:20
          },
        geo: {
          type: "map",
          map: "china",
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#2E72BF', //设置地图的区域颜色
            borderColor:'#333'  //设置地图省份边界的颜色
          }
        },
        legend:{
            left:"5%",
            bottom:'5%',
            textStyle:{
                // fontSize:20
            },
            orient:'vertical' //配置图例的方向
        }
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      //获取服务器的数据，对this.allData进行赋值后，调用updateChart方法更新图表
      const { data } = await this.$http.get("map");
      this.allData = data;
      console.log(data);
      this.updateChart(this.allData);
    },
    updateChart() {
      //处理图表需要的数据
      //图例的数据
      const lengendArr = this.allData.map((item) => {
        return item.name;
      });

      const seriesArr = this.allData.map((item) => {
        //return 的这个对象代表的是一个类别下的所有散点的数据
        //如果想在地图中显示散点的数据，我们需要给散点的图增加一个配置，coordinateSyste,:geo
        return {
          type: "effectScatter",
          rippleEffect:{ //涟漪动画设置
              scale:4,  //涟漪动画的大小设置
              brushType: 'stroke' //空心的涟漪动画

          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        series: seriesArr,
        legend: {
          data: lengendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      //屏幕适配
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
.com-chart {
  // width: 200px;
  // height: 400px;
}
</style>