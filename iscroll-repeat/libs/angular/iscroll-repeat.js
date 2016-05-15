/**
 * Created by zhutao on 16-5-4.
 */
(function (angular,IScroll) {

    angular.module("iscrollRepeat",[])
        .directive('iscrollRepeat', ['$parse', function($parse) {
            var options = {};
            //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            return {
                restrict:"A",
                transclude:"element",
                priority:1000,
                terminal:true,
                link:function ($scope,$element,$attrs,ctrl,$transclude) {
                    var expression = $attrs.iscrollRepeat || '',
                        match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/),
                        optionsFn = $attrs.swiperRepeatOptions ? $parse($attrs.swiperRepeatOptions) : null;

                    optionsFn && angular.extend(options, optionsFn($scope));

                    if (!match) {
                        throw new Error("Expected expression in form of '_item_ in _collection_' but got " + expression + ".");
                    }

                    var itemExp = match[1],
                        collectionExp = match[2],
                        previous = $element;


                    function slideFactory(item,key) {

                        var scope = $scope.$new();
                        scope[itemExp] = item;
                        scope.$index = key;

                        //此为编译阶段，向provider中加入要链接的工厂，最后插入dom，由父即子，
                        var element = $transclude(scope, function(clone){
                            previous.after(clone);
                            previous = clone;
                        });

                        return {

                            element: element,
                            item: item,

                            destroy: function() {
                                scope.$destroy();
                                element.remove();
                            }

                        }

                    }

                    $scope.$watchCollection(collectionExp, function(value) {
                        if(!value) return;
                        angular.forEach(value,slideFactory);
                        //在编译后，若直接new IScroll 则在以后的link阶段元素的高度会有变化，
                        //这个时候没有iscroll.refresh(),滚动会失效，因此将new IScroll延后到digest最后执行
                        //即在link之后执行，这个时候的ng-bind等都是有效的。
                        $scope.$evalAsync(function() {
                            $scope.myScroll = new IScroll('#wrapper',options);
                        });
                    });



                }
            }
        }]);

})(angular,IScroll);