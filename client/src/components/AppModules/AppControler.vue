<template>
  <Card id="control-card">
    <p slot="title" style="text-align:left">
      <Icon type="ios-settings" />
      Control Panel
    </p>
    <div id="controler"></div>
  </Card>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style scope>
#control-card {
  width: 16%;
  height: 100%;
  position: relative;
  float: left;
  /* left: 10%; */
  /* left: 0; */
  /* margin: 0.1% ; */
}
#controler {
  position: absolute;
  /* float: left; */
  /* top: 5%; */
  width: 100%;
  height: 100%;
  /* background-color: rgb(194, 40, 40); */
}
</style>