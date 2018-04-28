const BaseComponent = require('base/base-component');
class switchImg extends BaseComponent{
    constructor(){
        super()
    }
    init(){
        this.count=0;
        this.$itemBox=this.$el.find('.img');
        this.$item=this.$itemBox.find('li');
        this.$btnBox=this.$el.find('.num');
        this.$btn=null;
        this.componentInit()
    }

    componentInit(){
        let that=this;
        var clone = that.$item.first().clone();//克隆第一张图片
        that.$itemBox.append(clone);//复制到列表最后
        that.size = that.$item.length+1;
        for (var j = 0; j < that.size-1; j++) {
            that.$btnBox.append("<li></li>");
        }
        that.$btn=that.$btnBox.find('li');
        that.$btn.first().addClass("on");
        that.t = setInterval(function () { that.count++; that.move();},5000);
        that.bindEvent()
    }
    bindEvent(){
        let that=this;
        that.$btn.hover(function () {
            var index = $(this).index();//获取当前索引值
            that.count = index;
            that.$itemBox.stop().animate({ left: -index * 440 }, 440);
            $(this).addClass("on").siblings().removeClass("on");
        });
        that.$el.hover(function () {
            clearInterval(that.t);//鼠标悬停时清除定时器
        }, function () {
            that.t = setInterval(function () { that.count++; that.move(); }, 5000); //鼠标移出时清除定时器
        });
    }

    move() {
        let that=this;
        if (that.count == that.size) {
            that.$itemBox.css({ left: 0 });
            that.count = 1;
        }
        if (that.count == -1) {
            that.$itemBox.css({ left: -(that.size - 1) * 440 });
            that.count = that.size - 2;
        }
        that.$itemBox.stop().animate({ left: -that.count * 440 }, 440);
        if (that.count == that.size - 1) {
            that.$btn.eq(0).addClass("on").siblings().removeClass("on");
        } else {
            that.$btn.eq(that.count).addClass("on").siblings().removeClass("on");
        }
    }
}

module.exports = switchImg;