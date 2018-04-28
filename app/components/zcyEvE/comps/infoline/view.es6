const BaseComponent = require('base/base-component');
const getDate=require('common/getDate/extend')
class infoLine extends BaseComponent{
  constructor() {
    super()
  }
  init(){
    const date = new Date();
      const _y = date.getFullYear();
      const _m = date.getMonth()+1;
      const _d = date.getDate();
      const _nl = getDate();
      const _w = new Array("日", "一", "二", "三", "四", "五", "六");
      const week = new Date().getDay();
      this.$el.find(".today").text(_y+"年"+_m+"月"+_d+"日 星期"+_w[week]+" 农历"+_nl);
  }
}
module.exports = infoLine;