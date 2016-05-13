/*
 * create little message warn alert in the page bottom
 * auther :zt
 * data：2015/7/4
 */

(function($){

    var defaults = {
        name:"消息提示",
        style1:{
            width:'100%',
            position:'fixed',
            bottom:'50px',
            'text-align':'center',
            'z-index':'9999999'
        },
        style2:{
            'min-width':'50px',
            'display': 'inline-block',
            'font-size':'.9em',
            'padding':'6px 8px 6px 8px',
            'background-color':'black',
            'filter':'alpha(opacity=75)',
            '-moz-opacity':'0.75',
            '-khtml-opacity':'0.75',
            'opacity':'0.75',
            'color':'#fff'
        }
    };

    var $promise = {
        _queue:[],
        then:function (fn) {
            var that = this;

            this._queue.push(function () {
                setTimeout(function () {
                    that._queue.shift();
                    if(that._queue.length > 0){
                        that._queue[0]();
                    }
                },time);
            });

            if(this._queue.length == 1){
                this._queue[0]();
            }

            return this;
        },
        delay:function (time) {
            var that = this;

            this._queue.push(function () {
                setTimeout(function () {
                    that._queue.shift();
                    if(that._queue.length > 0){
                        that._queue[0]();
                    }
                },time);
            });

            if(this._queue.length == 1){
                this._queue[0]();
            }

            return this;
        },
        animate:function (prop,speed) {
            var that = this;
            this._queue.push(function () {
                $.fn.animate.bind(that)(prop,speed,null,function () {
                    that._queue.shift();
                    if(that._queue.length > 0){
                        that._queue[0]();
                    }
                });
            });
            if(this._queue.length == 1){
                this._queue[0]();
            }
            return this;
        }
    };

    //create alert Class

    function MegAlert(name){
        var $mgsView = $("<div><div class='plert-name'>"+name+"</div></div>");
        $mgsView.css(defaults.style1);
        $mgsView.children('div').css(defaults.style2);

        $.extend($mgsView,$promise);

        return $mgsView;
    }

    var megAlertShow  = function(){
        var msgAlert;
        var isShowed = false;
        return function(){
            if(isShowed) return;
            isShowed = true;
            msgAlert&&msgAlert.find('.plert-name').text(arguments[0]);
            $('body').append(msgAlert || ( msgAlert = MegAlert .apply( this, arguments )));

            msgAlert.delay(1500).animate({ opacity: 0},1000).delay(1500).animate({ opacity: 1},1000);
        };
    };



    window.plert = megAlertShow();

})($);