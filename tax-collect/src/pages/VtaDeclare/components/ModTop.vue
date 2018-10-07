<template>
  <div class="mod-top">
    <p class="mod-top-title">{{ _constant.VTADECLARETABLE_TYPE[active] }}</p>
    <div class="mod-list">
      <p>
        <span>纳税人名称:</span>
        <span>{{desc.wtrmc ? desc.wtrmc : '暂无'}}</span>
      </p>
      <p>
        <span>税款所属期:</span>
        <span>{{skssqq ? skssqq : '----'}}</span>
        <span>至</span>
        <span>{{skssqz ? skssqz : '----'}}</span>
      </p>
    </div>
    <div class="mod-list">
      <p>
        <span>统一社会信用代码</span>
        <span>{{desc.wtrtyshxydm ? desc.wtrtyshxydm : '暂无'}}</span>
      </p>
      <p>
        <span>金额单位</span>
        <span>元至角分</span>
      </p>
    </div>
  </div>
</template>

<script>
import util from '@/common/js/util';
export default {
  name: 'mod-top',
  props: ['active', 'desc'],
  computed: {
    skssqq: function () {
      return util.formateDate(this.desc.skssqq * 1);
    },
    skssqz: function () {
      return util.formateDate(this.desc.skssqz * 1)
    }
  }
}
</script>