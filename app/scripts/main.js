/**
 *  main.js
 *  author: Weiwei SUN
 */

(function($){
    require(
        [
            'echarts',
            'echarts/chart/force',
            'echarts/chart/chord'
        ],
        function(ec) {
            var myChart = ec.init(document.getElementById('main-area'));
            var secondChart = ec.init(document.getElementById('second'));

            var ecConfig = require('echarts/config');

            var option = {
                title : {
                    text: 'Graph Demo',
                    x:'right',
                    y:'bottom'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{a} : {b}'
                },
                toolbox: {
                    show : true,
                    feature : {
                        restore : {show: true},
                        magicType: {show: true, type: ['force', 'chord']}
                    }
                },
                legend: {
                    x: 'left',
                    data:['inner','outer']
                },
                series : [
                    {
                        type:'force',
                        name : "relationship",
                        ribbonType: false,
                        categories : [
                            { name: 'main' },
                            { name: 'inner' },
                            { name: 'outer' }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    }
                                },
                                nodeStyle : {
                                    brushType : 'both',
                                    borderColor : 'rgba(255,215,0,0.4)',
                                    borderWidth : 1
                                },
                                linkStyle: {
                                    type: 'curve'
                                }
                            },
                            emphasis: {
                                label: {
                                    show: false
                                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                },
                                nodeStyle : {
                                    //r: 30
                                },
                                linkStyle : {}
                            }
                        },
                        useWorker: false,
                        minRadius : 15,
                        maxRadius : 25,
                        gravity: 1.1,
                        scaling: 1.1,
                        draggable: false,
                        linkSymbol: 'arrow',
                        roam: 'move'
                    }
                ]
            };
            var option2 = {
                title : {
                    text: 'Graph Demo',
                    x:'right',
                    y:'bottom'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{a} : {b}'
                },
                toolbox: {
                    show : true,
                    feature : {
                        restore : {show: true},
                        magicType: {show: true, type: ['force', 'chord']}
                    }
                },
                legend: {
                    x: 'left',
                    data:['inner','outer']
                },
                series : [
                    {
                        type:'force',
                        name : "relationship",
                        ribbonType: false,
                        categories : [
                            { name: 'main' },
                            { name: 'inner' },
                            { name: 'outer' }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    }
                                },
                                nodeStyle : {
                                    brushType : 'both',
                                    borderColor : 'rgba(255,215,0,0.4)',
                                    borderWidth : 1
                                },
                                linkStyle: {
                                    type: 'curve'
                                }
                            },
                            emphasis: {
                                label: {
                                    show: false
                                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                },
                                nodeStyle : {
                                    //r: 30
                                },
                                linkStyle : {}
                            }
                        },
                        useWorker: false,
                        minRadius : 15,
                        maxRadius : 25,
                        gravity: 1.1,
                        scaling: 1.1,
                        draggable: false,
                        linkSymbol: 'arrow',
                        roam: 'move'
                    }
                ]
            };


            $.getJSON('./data/demo.json', function(json){
                option.series[0].nodes = json.nodes;
                option.series[0].links = json.links;
                myChart.setOption(option);
            });
            myChart.on(ecConfig.EVENT.CLICK, focus);
            myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END);

            function focus(param) {
                var data = param.data;
                //var links = option.series[0].links;
                var nodes = option.series[0].nodes;
                if (
                    data.source !== undefined && data.target !== undefined
                ) {
                    //点击的是边
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
                } else {
                    // 点击的是点
                    console.log("选中了" + data.name + '(' + data.value + ')');

                    $.getJSON('./data/search.json', function(json){
                        if(json[data.name]){
                            option2.series[0].nodes = json[data.name].nodes;
                            option2.series[0].links = json[data.name].links;
                            secondChart.setOption(option2);
                        } else {
                            console.log('Nothing matched!');
                        }
                    });

                }
            }

        }
    )


})(this.jQuery);