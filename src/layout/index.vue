<!--
 * @Author: your name
 * @Date: 2021-06-10 12:11:12
 * @LastEditTime: 2021-07-26 20:34:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /opinion-monit-web/src/layout/index.vue
-->
<template>
  <div id="app-main">
    <HomeAppBar />
    <HomeView />
  </div>
</template>

<script>
export default {
  components: {
    HomeAppBar: () => import('./home/AppBar.vue'),
    HomeView: () => import('./home/View.vue')
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
