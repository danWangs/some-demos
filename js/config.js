/*
 *@param author liuxinwei
 */

(function ($) {
    'use strict'
    !function () {
        var $parentFixed = $('.vs-cartype');
        if ($parentFixed.length > 0) {
            var parTop = $parentFixed.offset().top;
            var oBox = $parentFixed.find('.box');
            $(window).on('scroll', function () {
                if (parTop <= $('body').scrollTop()) {
                    // oBox.addClass('fixed');
                    oBox.css({
                        'position': 'fixed',
                        'top': '0px',
                        'left': '0px',
                        'right': '0px',
                        'zIndex': 99
                    });
                } else {
                    // oBox.removeClass('fixed');
                    oBox.attr("style","");
                }
            });
        }
    }();


    /*
     *@function swipleftRight 屏幕左右滑动
     */
    var swipleftRight = function (config) {
        this.config = $.extend({}, this.defaultOption, config);
        this.init();
    };
    swipleftRight.prototype = {
        defaultOption: {
            touchEle: $(".slide"),
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            distanceX: 0,
            distanceY: 0,
            lenArr: [],
            isMoveLen: 0,
            isMoved: false
        },
        init: function () {
            this.onEvent();
        },
        onEvent: function () {
            var _this = this;
            var $touch = _this.config.touchEle;
            $touch.on("touchstart", function (e) {
                _this.tStart(e);
            });
            $touch.on("touchmove", function (e) {
                _this.tMove(e);
            });
            $touch.on("touchend", function (e) {
                _this.tEnd(e);
            });
        },
        tStart: function (e) {
            var _this = this;
            var param = _this.config;
            param.startY = _this.getPos(e).posY;
            param.startX = _this.getPos(e).posX;
            param.isMoved = false;
        },
        tMove: function (e) {
            var _this = this;
            var param = _this.config;
            var $table = param.touchEle.find("table");
            if ($table.width() < 241) {
                return false;
            }
            param.endX = _this.getPos(e).posX;
            param.endY = _this.getPos(e).posY;

            param.distanceY = param.endY - param.startY;
            param.distanceX = param.endX - param.startX;

            if ((Math.abs(param.distanceY) - Math.abs(param.distanceX)) < 5) {
                param.isMoved = true;
                _this.moveTo(param.distanceX);
                e.preventDefault();
            }
        },
        tEnd: function (e) {
            var _this = this;
            var param = _this.config;
            if (param.isMoved) {
                param.isMoveLen = param.lenArr[param.lenArr.length - 1];
                param.lenArr.length = 0;
            }
        },
        moveTo: function (dis) {
            var _this = this;
            var param = _this.config;
            if (param.isMoveLen != 0) {
                dis = dis + param.isMoveLen;
            }
            var $table = param.touchEle.find("table");
            if ($table.width() < 241) {
                return false;
            }
            if (dis < 0 && dis <= -($table.width() - 241)) {
                dis = -($table.width() - 241);
            } else if (dis >= 0) {
                dis = 0;
            }
            param.lenArr.push(dis);
            param.touchEle.css('-webkit-transform', 'translate3d(' + dis + 'px,0,0)');
        },
        getPos: function (e) {
            return {
                posX: e.changedTouches[0].clientX,
                posY: e.changedTouches[0].clientY
            };
        }
    };
    /**
     * @function positionPop 目录定位
     */
    $.fn.positionPop = function (options) {
        var defaultOption = {

        };
        //将初始化自定义参数与默认参数合并
        options = $.extend({}, defaultOption, options);
        //遍历匹配的元素，此处的this表示对象集合
        return this.each(function () {
            $.fn.positionPop.init($(this), options);
        });
    };
    $.fn.positionPop.init = function ($this, options) {
        var _this = $this;
        var oBtn = $this.find("h1");
        var oPop = $this.find("ul");
        oBtn.on("click", function (e) {
            if (oPop.hasClass("fn-hide")) {
                oPop.removeClass("fn-hide")
            } else {
                oPop.addClass("fn-hide");
            }

        });
        oPop.find("li").on("click", function () {

        });
    };
    /*生成列表*/
    var compareList = function (config) {
        this.config = $.extend({}, this.defaultOption, config);
        this.init();
    };

    compareList.prototype = {
        defaultOption: {
            seriesId: "145",
            ids: [19250],
            seriesName: "POLO"
        },
        defaultParam: {
            stateLoad: false,
            currData: [],
            compareItems: []
        },
        init: function () {
            this.config.ids = this.config.ids.filter(function (item) { return item > 0; })
            this.getData(this.config.ids);
        },
        onEvent: function () {
            var _this = this;
            //减少
            $("i[type='close']").on("click", function () {
                var specId = parseInt($(this).attr('data-specId'));
                var arrWz = _this.config.ids.indexOf($(this).data('specid'));
                _this.config.ids.splice(arrWz, 1);
                _this.removeData(specId);
                _this.renderView();
                _this.controlPopItem('remove', specId);
                $('input[type="checkbox"]').prop('checked', false);
            });

            //添加
            $('td[type="add"]').on("click", function (e) {

                var stateLoad = _this.defaultParam.stateLoad;  //加载后 不在请求
                var url = PATH_LIST;
                if (!stateLoad) {
                    $.ajax({
                        url: url,
                        data: {
                            seriesId: _this.config.seriesId,
                            state: 4,
                            v: 1
                        },
                        dataType: "jsonp",
                        success: function (data) {
                            _this.renderPopList(data);
                            _this.defaultParam.stateLoad = true;
                            $('#loadSpec').show();
                            $('.wrapper').hide();
                        }
                    });
                } else {
                    $('#loadSpec').show();
                    $('.wrapper').hide();
                }
            });

            //隐藏相同
            $("#any1").on("click", function () {
                var isCheck = $(this).is(":checked");
                if (isCheck) {
                    $(".js-same").hide();
                } else {
                    $(".js-same").show();
                }
            });
            //差异高亮
            $("#any2").on("click", function () {
                var isCheck = $(this).is(":checked");
                if (isCheck) {
                    $(".js-difference").addClass("highlight");
                } else {
                    $(".js-difference").removeClass("highlight");
                }
            });
            //定位
            $(".anchorsite h1").off("click.anchorsite").on("click.anchorsite", function (e) {
                var oPop = $(this).siblings().eq(0);
                oPop.toggleClass("fn-hide");
                e.stopPropagation();
                oPop.find("li").on("click", function (e) {
                    var scrollto = $(this).attr("data-scrollto"), divGroup = $("#divGroup" + scrollto);
                    var top = $("#divGroup" + scrollto).offset().top;
                    window.scrollTo(0, top);
                    oPop.addClass("fn-hide");
                });
                $(document).off("click.closeanchorsite").one("click.closeanchorsite", function () {
                    $(".anchorsite").find("ul").addClass("fn-hide");
                });
            });

        },
        getData: function (ids) {
            var _this = this;
            if (ids.length == 0) {
                _this.renderEmptyView();
                return;
            }
            var url = PATH_DATA + ids;
            $.getJSON(url, function (d) {
                if (d == null || d == undefined || d.param == null || d.param == undefined || d.config == null || d.config == undefined) {
                    return;
                }
                _this.defaultParam.currData = [];
                //参数
                _this.defaultParam.currData = d.param.concat(d.config);
                _this.renderView();
            });

        },
        renderView: function () {
            //加载标题
            this.renderTitle();
            //加载表格内容
            this.rendContent();
            //加载生成定位pop
            this.renderPositionPop();
            //加载绑定事件
            this.onEvent();
            $('input[type="checkbox"]').prop('checked', false);

            // 后加载内容
            this.rendTailContent();
        },
        renderEmptyView: function () {
            //加载标题
            this.renderTitle();
            //加载绑定事件
            this.onEvent();
        },
        renderTitle: function () {
            var _this = this,
                d = _this.defaultParam.currData,
                valueItems = d.length > 0 ? _this.getTitleItems(d) : [],
                html = '';
            if (valueItems) {
                html = '<table cellpadding="0" cellspacing="0"><tbody><tr>';
                for (var i = 0; i < valueItems.length + 1; i++) {

                    if (valueItems[i] && valueItems[i].specid != 0) {
                        html += '<td class="added" index="' + i + '" data-specid="' + valueItems[i].specid + '">' + valueItems[i].value + '<span>' + (i + 1) + '</span><i class="iconfont icon-add"></i><i class="iconfont icon-cross" type="close" data-specid="' + valueItems[i].specid + '"></i></td>';
                    } else {
                        if (i <= 3) {
                            html += '<td class="" type="add" index="' + i + '" data-specid="0"><span>' + (i + 1) + '</span><i class="iconfont icon-add"></i><i class="iconfont icon-cross" type="close"></i></td>';
                        }
                    }

                }
                html += "</tr></tbody></table>";
            }
            $("strong[type = 'vs-count']").html(valueItems.length);
            $(".slide").eq(0).html(html);
        },
        rendContent: function () {
            //生成对比参数表格
            var _this = this,
                d = _this.defaultParam.currData,
                titleHtml = '',
                html = '',
                count = 0;
            html += '<table cellpadding="0" cellspacing="0">';
            for (var i in d) {
                var groupName = d[i].name;
                //添加vs标题信息
                titleHtml += '<dl><dt><h1 id="divGroup' + count + '">' + groupName + '<span>●&nbsp;标配&nbsp;&nbsp;○&nbsp;选配&nbsp;&nbsp;-&nbsp;无</span></h1></dt>';
                //添加表格内容
                html += "<tr><th>&nbsp;</th></tr>"
                html += "";
                if (d[i].paramitems) {
                    var groupItems = d[i].paramitems;
                    for (var j in groupItems) {
                        var itemName = groupItems[j].name;
                        var items = groupItems[j].valueitems;
                        var isSame = _this.checkSameItem(items);

                        if (isSame) {
                            html += '<tr class="js-same">';
                            //添加vs标题信息
                            titleHtml += '<dd class="js-same"><span>' + itemName + '</span></dd>';
                        } else {
                            html += '<tr class="js-difference">';
                            //添加vs标题信息
                            titleHtml += '<dd><span>' + itemName + '</span></dd>';
                        }
                        var index = 0;
                        for (var k in items) {
                            if (items[k] !== null && items[k] !== undefined) {
                                html += '<td index="' + index + '" data-specid="' + items[k].specid + '" ><p>' + items[k].value + '</p></td>';
                            }

                            index++;

                        }
                        html += '</tr>';

                        if (itemName == '厂商指导价(元)') {
                            html += '<tr class="js-subsidy js-difference fn-hide">';
                            var index = 0;
                            for (var k in items) {
                                if (items[k] !== null && items[k] !== undefined) {
                                    html += '<td index="' + index + '" data-specid="' + items[k].specid + '" ><p>-</p></td>';
                                }
                                index++;
                            }
                            html += '</tr>';
                            titleHtml += '<dd class="js-subsidy fn-hide"><span>国家/地方补贴(元)</span></dd>';

                            html += '<tr id="trMinPrice" class="js-difference">';
                            var index = 0;
                            for (var k in items) {
                                if (items[k] !== null && items[k] !== undefined) {
                                    html += '<td class="inquiry-td" index="' + index + '" data-specid="' + items[k].specid + '" ><p>加载中...</p></td>';
                                }
                                index++;
                            }
                            html += '</tr>';
                            titleHtml += '<dd><span class="inquiry-span">本地参考底价(元)</span></dd>';
                        }
                    }
                }
                if (d[i].configitems) {
                    var groupItems = d[i].configitems;
                    for (var j in groupItems) {
                        var itemName = groupItems[j].name;
                        var items = groupItems[j].valueitems;
                        var isSame = _this.checkSameItem(items);
                        if (isSame) {
                            html += '<tr class="js-same">';
                            //添加vs标题信息
                            titleHtml += '<dd class="js-same"><span>' + itemName + '</span></dd>';
                        } else {
                            html += '<tr class="js-difference">';
                            //添加vs标题信息
                            titleHtml += '<dd><span>' + itemName + '</span></dd>';
                        }
                        var index = 0;
                        for (var k in items) {
                            if (items[k] !== null && items[k] !== undefined) {
                                html += '<td index="' + index + '" data-specid="' + items[k].specid + '" ><p>' + items[k].value + '</p></td>';
                            }
                            index++;
                        }
                        html += '</tr>';
                    }
                }
                titleHtml += "</dl>";
                count++;
            }
            html += "</table>";
            $("div[type ='vs-title']").html(titleHtml);
            $(".slide").eq(1).html(html);
        },
        rendTailContent: function () {
            var _this = this,
                ids = _this.config.ids,
                cityid = $.getCookie('cookieCityId') == undefined ? '' : $.getCookie('cookieCityId'),
                url = PATH_PRICE + ids + "&city=" + cityid, XunJiaPvId = '';
            if (PageType == null || PageType == undefined || PageType == 0) {
                return;
            }
            else {
                XunJiaPvId = PageType == 1 ? "#pvareaid=105222" : PageType == 2 ? "#pvareaid=105273" : ""
            }
            var eid = 'eid=2|1211002|572|3285|200095|300000';

            if (PageType == 2)
            {
                eid = 'eid=2|1211002|572|3286|200095|300000';

            }


            $.getJSON(url, function (d) {
                if (d == null || d == undefined || d.body == null || d.body == undefined || d.body.item == null || d.body.item == undefined) {
                    return;
                }
                for (var i in d.body.item) {
                    var item = d.body.item[i];
                    var html = ' <span class="price-inquiry">' + (item.MinPrice / 10000).toFixed(2) + '万</span><a class="icon-inquiry" href="http://dealer.m.autohome.com.cn/dealer/order-' + item.SeriesId + '-' + item.SpecId + '.html?' + eid + '' + XunJiaPvId + '"><i class="iconfont icon-mobile"></i>询底价</a>'

                    if (cityid == '') {
                        html = '<span class="price-inquiry">-</span>';
                    }

                    $('#trMinPrice [data-specid="' + item.SpecId + '"]').html(html);
                }

                $('#trMinPrice td').each(function () {
                    if ($(this).text() == '加载中...') {
                        $(this).html('<p>暂无</p>');
                    }
                });
            });

            if ($.grep(_this.defaultParam.currData, function (n) { return n.name == '电动机'; }).length > 0) {
                var url = PATH_SUBSIDY.replace('$spec', ids).replace('$city', parseInt(($.getCookie('cookieCityId') || $.getCookie('area') || 0) / 100) * 100||0);
                $.getJSON(url, function (d) {
                    if (!d || d.returncode > 0 || d.result.specitems.length == 0) {
                        return;
                    }
                    for (var i in d.result.specitems) {
                        var item = d.result.specitems[i];
                        if (item.countrysubsidy > 0 || item.citysubsidy > 0) {
                            $('.js-subsidy [data-specid="' + item.id + '"] p').html((item.countrysubsidy > 0 ? ((item.countrysubsidy / 10000).toFixed(2) + '万') : '-')
                                + '/'
                                + (item.citysubsidy > 0 ? ((item.citysubsidy / 10000).toFixed(2) + '万') : '-'));
                            $('.js-subsidy').removeClass('fn-hide');
                        }
                    }
                });
            }

        },
        renderPositionPop: function () {
            var _this = this,
                d = _this.defaultParam.currData,
                wrap = $(".anchorsite").find("ul"),
                html = "",
                count = 0;
            for (var i in d) {
                var groupName = d[i].name;
                html += '<li data-scrollto ="' + count + '">' + groupName + '</li>';
                count++;
            }
            wrap.html(html);
        },
        getTitleItems: function (d) {
            var titleItems = [];
            for (var p in d) {
                if (d[p].name === "基本参数") {
                    for (var pItem in d[p].paramitems) {
                        if (d[p].paramitems[pItem].name === "车型名称") {
                            return d[p].paramitems[pItem].valueitems;
                        }
                    }
                }
            }
            return null;
        },
        removeData: function (id) {
            var data = this.defaultParam.currData;
            for (var i in data) {
                var groupName = data[i].name;
                if (data[i].paramitems) {
                    var groupItems = data[i].paramitems;
                    for (var j in groupItems) {
                        var itemName = groupItems[j].name;
                        var items = groupItems[j].valueitems;
                        for (var k in items) {
                            if (items[k] !== null && items[k] !== undefined && items[k].specid === id) {

                                var index = items.indexOf(items[k]);
                                if (index > -1) {
                                    items.splice(index, 1);
                                }
                            }
                        }
                    }
                }
                if (data[i].configitems) {
                    var groupItems = data[i].configitems;
                    for (var j in groupItems) {
                        var itemName = groupItems[j].name;
                        var items = groupItems[j].valueitems;
                        for (var k in items) {
                            if (items[k] !== null && items[k] !== undefined && items[k].specid === id) {

                                var index = items.indexOf(items[k]);
                                if (index > -1) {
                                    items.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        },
        checkSameItem: function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i + 1] && (data[i].value != data[i + 1].value)) {
                    return false;
                }
            }
            return true;
        },
        renderPopList: function (json) {
            var html = template('popListData', json);
            document.getElementById('loadSpec').innerHTML = html;
            this.popEvent();
            for (var i = 0; i < this.config.ids.length; i++) {  //渲染默认选中得ID的项目
                this.controlPopItem('add', this.config.ids[i]);
            }
        },
        popEvent: function () {
            var self = this;
            $('#loadSpec').off('click.popList');
            $('#loadSpec').on('click.popList', '#common_specselect_list li a', function (data) {
                if ($(this).hasClass('w-disabled')) {  //选中过得不在可选
                    return false;
                }
                $('#loadSpec').hide();
                $('.wrapper').show();
                var oId = $(this).data('id')
                self.controlPopItem('add', oId)
                if (self.config.ids.indexOf(oId) > -1 || self.config.ids.length > 3) {  //判断是否用重复ID 和 是否已经4个元素
                    return false;
                }
                self.config.ids.push(oId);
                console.log(self.config.ids);
                self.getData(self.config.ids);
            });
        },
        controlPopItem: function (ctrl, specId) {

            var $nowIt = $('#loadSpec').find('[data-id="' + specId + '"]');
            var $caption = $nowIt.find('.caption');
            if (ctrl == 'remove') {
                $nowIt.removeClass('w-disabled')
                $caption.text() && $caption.text($caption.text().replace(/\(已选择\)/g, ''));
            } else {
                $nowIt.addClass('w-disabled')
                $caption.text($caption.text() + '(已选择)');
            }
        }

    };

    //数据接口
    var PATH_LIST = "/ashx/car/loadspecbyseriesid.ashx",
        PATH_DATA = '/ashx/car/GetModelConfig.ashx?ids=',
        PATH_PRICE = "http://car.interface.autohome.com.cn/dealer/LoadDealerPrice.ashx?type=4&_callback=?&specid=",
        PATH_SUBSIDY = "http://car.interface.autohome.com.cn/Car/GetSpecElectricSubsidy.ashx?_callback=?&speclist=$spec&cityid=$city";

    $(function () {
        //屏幕左右滑动
        new swipleftRight();
        $('#loadSpec').on('click', '.w-nav-mini-btn', function () {
                $(this).siblings('.w-nav-mini-pop').toggleClass('w-fn-hide');
                return false;
            })
            .on('click', '.w-nav-back', function () {
                $('#loadSpec').hide();
                $('.wrapper').show();
                return false;
            });

    });

    window.compareList = compareList;
    //
})(jQuery)/**
 * Created by wangdan on 16/3/31.
 */
