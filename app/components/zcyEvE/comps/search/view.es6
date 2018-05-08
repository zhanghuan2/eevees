const BaseComponent = require('base/base-component');
class globalSearch extends BaseComponent{
  constructor() {
    super({
      events:{
          "input .mainkeyword":"shapeShow",
          "click .icon-Shape":"emptyInput",
          "keydown .mainkeyword":"enterSearch",
          "click .Jsearch":"btnSearch"
      }
    })
  }

  init(){
    this.$input=this.$el.find('.mainkeyword');
  }

  btnSearch(e){
    const el = e.target || e.srcElement;
    let isExact = $(el).data("exact");
    let keyword=this.$input.val();
    location.href=`/cpa/fulltext_search?m=0&k=${keyword}&exact=${isExact}`;
  }

  emptyInput(e){
      this.$input.val("");
      $(e.target).hide();
  }

  enterSearch(e){
    let keyword=this.$input.val();
    e.keyCode == 13&&(location.href=`/cpa/fulltext_search?m=0&k=${keyword}`)
  }

  shapeShow(e){
      const $ele =$(e.target || e.srcElement);
      if ($ele.val().length > 0) {
          this.$el.find(".icon-Shape").show();
      } else {
          this.$el.find(".icon-Shape").hide();
      }
  }
  
}
module.exports = globalSearch;