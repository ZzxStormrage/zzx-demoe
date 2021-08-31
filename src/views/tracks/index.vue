<template>
  <div />
</template>

<script>
import { getData } from './index.js'

export default {
  components: {},
  data() {
    return {
      data: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getTackList()
  },
  mounted() {

  },
  methods: {
    // 模拟数据请求
    getTackList() {
      return new Promise((resolve, reject) => {
        this.$get('./map.json').then(res => {
          if (res.code === 200) {
            this.data = res.data
            resolve(res.data)
            getData(res.data)
          } else {
            reject()
            alert(res.msg || '未知错误')
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
