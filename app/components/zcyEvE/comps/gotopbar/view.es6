const BaseComponent = require('base/base-component');
class goTop extends BaseComponent{
  constructor(){
      super({
        events: {                      
          "click .gotop": 'gotopEvent'
        }
      })
  }

  init(){
    this.$container=this.$el.find('.gotop-box');
    this.flag=true;
    let that=this;
    $(window).on('scroll',function(){
        const _scrollTop = $(document).scrollTop()
        if(_scrollTop > 1&&that.flag){
            that.flag=false;
            that.$container.slideDown('fast')
        }else if(_scrollTop <=1){
            that.flag=true;
            that.$container.slideUp('fast')
        }
    })
  }

  gotopEvent(){
    $('html , body').animate({scrollTop: 0},300)
  }
}
module.exports = goTop;