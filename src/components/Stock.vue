<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
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
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter;
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref);
      const initOption = {};
      this.chartInstance.setOption(initOption);
    },
    //获取数据
    async getData() {
      const { data } = await this.$http.get("stock");
      console.log(data, "data");
      this.allData=data
      this.updateChart();
    },
    //处理图表需要的数据
    updateChart() {
      //饼图所在的位置数据
      const centerArr=[
        ["18%","40%"],
        ["50%","40%"],
        ["82%","40%"],
        ["34%","75%"],
        ["66%","75%"],
      ]
      const showData=this.allData.slice(0,5)
      const seriesArr=showData.map((item,index)=>{
        return {
          type:'pie',
          radius:[110,100],
          center:centerArr[index],
          data:[{
            value:item.sales
          },{
            value:item.stock
          }]
        }
      })
      const dataOption={
        series:seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },

    screenAdapter(){
      const adapterOption={}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
};
</script>
<style lang="scss" scoped>
</style>