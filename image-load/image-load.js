(function ($) {
    var GET = function (imgId) {
        return window.localStorage?localStorage.getItem(imgId):false;
    };
    var SET = function (imgId,data) {
        return window.localStorage?localStorage.setItem(imgId, data):false;
    };

    var getImg = function (img,callback){
        var imgStr = img;
        if(typeof img == 'string'){
            var imageCache = GET(img);
            if(imageCache) return callback&&callback(imageCache);
            var imgObj = new Image();
            imgObj.src = img;
            img = imgObj;

        }else{

            var imageCache = GET(img.dataSrc);
            if(imageCache) return callback&&callback(imageCache);

            img.src = img.dataSrc;
        }

        img.onload = function () {
            renderCvs(img,function (data){
                SET(img.src,data);
                if(typeof imgStr == 'string') callback&&callback(data);
            });
        }
    };
    
    function renderCvs(img,callback) {
        try{
            var cvs = document.createElement('canvas');
            cvs.style.display = 'none';
            document.body.appendChild(cvs);
            var rcvs = cvs.getContext('2d');
            cvs.width = img.width||140;
            cvs.height = img.height||108;
            rcvs.drawImage(img,0,0,cvs.width,cvs.height);
            setTimeout(function(){
                img.crossOrigin = "Anonymous";
                var data = cvs.toDataURL();
                callback&&callback(data);
                document.body.removeChild(cvs);
            },200);
        }catch(ex){
            console.log("renderCvs Error",ex);
            throw  new Error("renderCvs run error !!");
        }
    }

    /*getImg("http://192.168.1.198:8000/xshop-web-pinpin/webapp/img/pin-default.jpg",function (data){
        console.log(data);
    });*/

    var deffer = {
        _queue:[],
        status:"",
        data:null,
        then:function (fn) {
            if(this.status === "resolved"){
                fn(this.data);
            }else{
                this._queue.push(fn);
            }
        },
        resolve:function (data) {
            this.data = data;
            this.status = "resolved";
            this._queue.forEach(function (value) {
                value(data);
            })
        }
    };

    getImg("pin-default.jpg",function (data){
        deffer.resolve(data);
    });


    $(function () {
        $("img[data-src]").forEach(function (value,key) {
            //获取data-src
            var src = $(value).attr("data-src");
            value.dataSrc = src;
            var locked = false;
            //优先显示默认图片
            deffer.then(function (data) {
                if(locked) return;
                value.src = data;
            });
            //加载显示data-src上的图片
            getImg(value,function (data) {
                locked = true;
                value.src = data;
            });
        });
    });

})($);

