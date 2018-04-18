/**
 * 图片新闻
 */
class switchImg{
    constructor(){
        this.count=0;
        this.$container=$('.js-shuffling-pic');
        this.$itemBox=$('.shuffling-pic .img');
        this.$item=this.$itemBox.find('li');
        this.$btnBox=$('.shuffling-pic .num');
        this.$btn=null;
        this.init();
        this.bindEvent();
    }

    init(){
        let that=this;
        var clone = this.$item.first().clone();//克隆第一张图片
        that.$itemBox.append(clone);//复制到列表最后
        that.size = this.$item.length+1;
        for (var j = 0; j < that.size-1; j++) {
            this.$btnBox.append("<li></li>");
        }
        that.$btn=that.$btnBox.find('li');
        that.$btn.first().addClass("on");
        that.t = setInterval(function () { that.count++; that.move();},5000);
    }

    bindEvent(){
        let that=this;
        that.$btn.hover(function () {
            var index = $(this).index();//获取当前索引值
            that.count = index;
            that.$itemBox.stop().animate({ left: -index * 440 }, 440);
            $(this).addClass("on").siblings().removeClass("on");
        });
        that.$container.hover(function () {
            clearInterval(that.t);//鼠标悬停时清除定时器
        }, function () {
            that.t = setInterval(function () { that.count++; that.move(); }, 5000); //鼠标移出时清除定时器
        });
    }

    move() {
        let that=this;
        if (that.count == that.size) {
            this.$itemBox.css({ left: 0 });
            that.count = 1;
        }
        if (that.count == -1) {
            this.$itemBox.css({ left: -(that.size - 1) * 440 });
            that.count = that.size - 2;
        }
        this.$itemBox.stop().animate({ left: -that.count * 440 }, 440);
        if (that.count == that.size - 1) {
            this.$btn.eq(0).addClass("on").siblings().removeClass("on");
        } else {
            this.$btn.eq(that.count).addClass("on").siblings().removeClass("on");
        }
    }
}

module.exports = switchImg;