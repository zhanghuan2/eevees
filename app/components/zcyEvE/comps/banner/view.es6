const BaseComponent = require('base/base-component');
class banner extends BaseComponent{
  constructor($) {
    super()
  }
  init(){
    let that=this;
    this.cd=3
    $(document).ready(function(){
        const countDown = setInterval(() => {
            that.cd--
            if (that.cd> 0) {
                that.$el.find('.banner-container span').text(that.cd+ "秒")
            } else {
                that.$el.animate({
                    height: 0
                })
                clearInterval(countDown)
            }
        }, 1000)
    })
  }

}
module.exports = banner;