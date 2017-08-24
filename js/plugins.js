/**
 * Created by wangdan on 16/2/17.
 */
(function ($) {
    $.fn.myPlugin = function () {
        this.fadeOut('slowly');
    };
    $.fn.hoverElement = function () {
        this.each(function () {
            $(this).hover(
                function () {
                    $(this).addClass("Add");
                },
                function () {
                    $(this).removeClass("Add");
                }
            );
        })
    };
    $.fn.textHover = function (options) {//options 经常用这个表示有许多个参数。

        var defaultVal = {

            Text: 'Your mouse is over',
            ForeColor: 'red',
            BackColor: 'gray'
        };
        //默认值
        var obj = $.extend(defaultVal, options);

        return this.each(function () {

            var selObject = $(this);//获取当前对象

            var oldText = selObject.text();//获取当前对象的text值
            var oldBgColor = selObject.css("background-color");//获取当前对象的背景色
            var oldColor = selObject.css("color");//获取当前对象的字体的颜色

            selObject.hover(function () {//定义一个hover方法。

                    selObject.text(obj.Text);//进行赋值
                    selObject.css("background-color", obj.BackColor);//进行赋值
                    selObject.css("color", obj.ForeColor);//进行赋值
                },
                function () {
                    selObject.text(oldText);
                    selObject.css("background-color", oldBgColor);
                    selObject.css("color", oldColor);
                }
            );
        });
    }
})(jQuery);