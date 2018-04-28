const BaseComponent = require('base/base-component');
const Util = require('helper/util')

class headNav extends BaseComponent{
  constructor($) {
    super({})
  }
  init(){
    this.float=this.$el.find('.inner-container').data('float');
    let that=this;
    if(!Util.isIE(8)){
        that.$el.find('.js-head-menu').lavalamp({
            easing: 'easeOutBack'
        })
    }
    /*头部浮动 */
    if(that.float&&that.float!=="missing helper"){
      $(window).on('scroll',()=>that.headFolat())
    }
    
  }
  headFolat(){
    const that=this;
    const _scrollTop = $(document).scrollTop()
    if (_scrollTop > 30)
      {
        that.$el.addClass('floating');
      }else{
        that.$el.removeClass('floating');
      }
    }
}
module.exports = headNav;