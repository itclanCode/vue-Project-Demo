
<script>
export default {
  name: 'add',
  methods: {
    addData() {
      this.$emit('addEvent');
    }
  },
  render(createElement) {
    return createElement('div', {
      class: 'add',
    }, [
      createElement('i', {
        class: 'el-icon-rep-jiahao',
        on: {
          click: this.addData
        }
      }),
      createElement('span', '可点击左边加号按钮增加行', {
        class: 'add-dec',
      })
    ])
  }
}
</script>

<style lang="stylus" scoped>
.add {
  padding: 10px 0px;
  margin-bottom:10px;
  font-size: 13px;
  color: #655757;
  background-color: #fff;
  position: relative;
  .el-icon-rep-jiahao {
    cursor: pointer;
    border-right: 1px solid #e5e5e5;
    width: 49px;
    height:100%;
    display:inline-block;
    position: absolute;
    top:0;
    left: 0;
    line-height: 36px;
    font-size:27px;
  }
}
</style>