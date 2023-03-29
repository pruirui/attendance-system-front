
<template>


    <div class="weather">
      <div id="he-plugin-standard"></div>
    </div>
  </template>         
  <script lang="ts">
  window.WIDGET = {
        "CONFIG": {
        "layout": "1",
        "width": "400",
        "height": "170",
        "background": "4",
        "dataColor": "000000",
        "backgroundColor": "FFFFFF",
        "language": "zh",
        "aqiColor": "000000",
        "key": "5795d36cae334aac835d35944e564d04"
    }
  };
  import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
  export default defineComponent({
   
    //vue3.0的写法
    setup() {
      onMounted(() => {
          weather()
      });
      const weather = () => {
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src =
        "https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0";
        document.body.appendChild(s);
      };
   
      return {};
    }
  });
  </script>
  <style lang="scss" scoped>
  .weather {
    width: 60px !important;
    height: 100%;
  }
  </style>