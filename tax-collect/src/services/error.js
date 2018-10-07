const init = function () {
  const _this = this;
  // 建议为了方便使用，这里可以包装window.Alert
  window.Alert = function (msg, duration = 5000) {
    _this.$message({
      message: msg,
      type: 'error',
      duration
    })
  }

  window.Tips = function (msg, duration = 5000) {
    _this.$message({
      message: msg,
      type: 'info',
      duration
    })
  }

  window.Warning = function (msg, duration = 5000) {
    _this.$message({
      message: msg,
      type: 'warning',
      duration
    })
  }

  window.Success = function (msg, duration = 5000) {
    _this.$message({
      message: msg,
      type: 'success',
      duration
    })
  }
};

export default {
  init
}
