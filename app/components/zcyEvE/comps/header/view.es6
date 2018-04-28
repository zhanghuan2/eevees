const BaseComponent = require('base/base-component');
class topLine extends BaseComponent{
  constructor() {
    super()
  }
  init(){
    const date = new Date();
    const hour = date.getHours();
    let _t = '';
    if (hour <= 24&&hour>17||hour<5){
        _t = "晚上好 ,"
    }else if (hour < 12){
        _t = "上午好 ,"
    }else if (hour <= 17){
        _t = "下午好 ,"
    }
    this.$el.find('.top-welcome').prepend(_t)
  }
}
module.exports = topLine;