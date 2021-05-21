<template>
  <div id="app">
    <AppLayout></AppLayout>
  </div>
</template>

<script>
import AppLayout from "./components/AppLayout";
export default {
  name: "App",
  components: {
    AppLayout,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  /* overflow: scroll; */
}
#app {
  position: fixed;
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #fff; */
  /* margin-top: 60px; */
}

/* hide MapBox bottom text */
.mapboxgl-ctrl-bottom-right {
  display: none;
}

.ivu-card-body {
  padding: 0px;
}

.ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 10px 16px;
  line-height: 1;
}

/* .layout-footer-center{
    text-align: center;
} */
</style>
