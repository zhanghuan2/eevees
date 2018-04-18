/**
 * @fileoverview
 * Component公共基类
 * 实现事件代理模块
 * 公共初始化入口
 * @author chenkaixia@cai-inc.com (chenkaixia)
 */
const delegateEventSplitter = /^(\S+)\s*(.*)$/;
const viewOptions = [ '$el', 'events' ];
class BaseComponent {
  constructor (options) {
    _.extend(this, _.pick(options, viewOptions));
    this.undelegateEvents();
    this.delegateEvents();
    this.init();
  }
  delegateEvents (events) {
    events || (events = _.result(this, 'events'));
    if (!events) { return this; }
    this.undelegateEvents();
    for (const key in events) {
      let method = events[key];
      if (!_.isFunction(method)) { method = this[method]; }
      if (!method) { continue; }
      const match = key.match(delegateEventSplitter);
      this.delegate(match[1], match[2], _.bind(method, this));
    }
    return this;
  }

  delegate (eventName, selector, listener) {
    this.$el.on(`${eventName}.delegateEvents`, selector, listener);
    return this;
  }

  undelegateEvents () {
    if (this.$el) { this.$el.off('.delegateEvents'); }
    return this;
  }

  undelegate (eventName, selector, listener) {
    this.$el.off(`${eventName}.delegateEvents`, selector, listener);
    return this;
  }
  destroy () {
    this.undelegateEvents();
  }
  init () {

  }
  beforeRander(tar){
    if(tar){
      this.$el = $(tar);
    }
    this.undelegateEvents();
    this.delegateEvents();
  }
  showCallback () {
   console.log('showCallback')
  }
}
module.exports = BaseComponent