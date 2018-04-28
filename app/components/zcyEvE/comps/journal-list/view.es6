const BaseComponent = require('base/base-component');
class journalList extends BaseComponent{
  constructor(){
    super({
      events: {                      
        "mouseenter .journal-num li": 'hoverEvent'
      }
    })
  }
  hoverEvent(e){
    $(e.currentTarget).addClass('active').siblings().removeClass('active');
  }
}
module.exports = journalList;