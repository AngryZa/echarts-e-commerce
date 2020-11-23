<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>▍{{ showTitle }}</span>
      <span :style="comStyle" class="iconfont title-icon" @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="(item, key) in selectTypes"
          :key="key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器数据
      showChoice: false, //是否显示可选项
      choiceType: "map", //默认显示数据类型
      titleFontSize:null  //指明标题的字体大小
    };
  },
  watch: {},
  computed: {
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key != this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    //设置给标题的样式
    comStyle(){
      return {
        fontSize:this.titleFontSize+'px'
      }
    },
    marginStyle(){
      return {
        marginLeft:this.titleFontSize +'px'
      }
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        grid: {
          left: "3%",
          top: "30%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      //await this.$http.get()
      const { data } = await this.$http.get("trend");
      this.allData = data;
      //  console.log(this.allData,'alldata')
      this.updateChart();
    },
    updateChart() {
      //半透明的颜色值
      const colorArr1 = [
        "rgba(11,168,44,0.5)",
        "rgba(44,110,255,0.5)",
        "rgba(22,242,217,0.5)",
        "rgba(254,33,30,0.5)",
        "rgba(250,105,0,0.5)",
      ];
      const colorArr2 = [
        "rgba(11,168,44,0)",
        "rgba(44,110,255,0)",
        "rgba(22,242,217,0)",
        "rgba(254,33,30,0)",
        "rgba(250,105,0,0)",
      ];
      //处理数据
      // console.log(this.allData)
      //类目轴
      const timeArr = this.allData.common.month;
      //
      // const yAxisData=this.allData[choiceType].data
      // console.log(this.choiceType,'choiceType')
      const yAxisData = this.allData[this.choiceType].data;
      const seriesArr = yAxisData.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          // 注意stack---数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加。
          // stack:this.allData[choiceType],
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });

      const legendArr = yAxisData.map((item) => {
        return item.name;
      });

      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend:{
          itemWidth:this.titleFontSize,
          itemHeight:this.titleFontSize,
          itemGap:this.titleFontSize,
          textStyle:{
            fontSize:this.titleFontSize/2
          }
        }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updateChart();
      this.showChoice = false;
    },
  },
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
};
</script>
<style lang="scss" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #ffffff;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
/* .select-item{
  text-indent: 4rem;
} */
select-con{
  background-color: #222333;
}
</style>