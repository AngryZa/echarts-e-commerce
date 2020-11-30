<template>
  <div class="com-page">
    <single-map></single-map>
  </div>
</template>

<script>
import Map from "@/components/Map";
export default {
  components: {
    "single-map": Map,
  },
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100;
}
</style>