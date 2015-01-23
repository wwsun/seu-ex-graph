/**
 *  main.js
 *  author: Weiwei SUN
 */

(function($){
    require(
        [
            'echarts',
            'echarts/chart/force',
            'echarts/chart/chord',
            'echarts/chart/funnel',
            'echarts/chart/pie'
        ],
        function(ec) {

            var exGraph = {
                ecConfig : require('echarts/config'),

                //chart
                mainChart : ec.init(document.getElementById('main-area')),
                detailChart : ec.init(document.getElementById('detail-area')),
                funnelChart : ec.init(document.getElementById('detail-funnel')),
                pieChart : ec.init(document.getElementById('detail-pie')),

                // chart option
                mainChartOption : {
                    title : {
                        text: 'Main Graph',
                        x:'right',
                        y:'bottom'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: '{a} : {b}'
                    },
                    color : [
                        '#996699', '#9999CC', '#CCCCFF'
                    ],
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
                                            color: '#000000'
                                        }
                                    },
                                    nodeStyle : {
                                        borderWidth : 0
                                    },
                                    linkStyle: {
                                        type: 'curve'
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false
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
                },
                detailChartOption : {
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
                    color: [
                        '#996699', '#9999CC', '#CCCCFF'
                    ],
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
                                            color: '#000'
                                        }
                                    },
                                    nodeStyle : {
                                        borderWidth : 0
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
                },
                funnelChartOption : {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                        show : false
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        data : ['Homepage','Search','Electronics','Computer','Product Detail']
                    },
                    color: [],
                    calculable : true,
                    series : [
                        {
                            name:'漏斗图',
                            type:'funnel',
                            width: '50%',
                            data:[
                                {value:60, name:'Homepage'},
                                {value:40, name:'Search'},
                                {value:20, name:'Electronics'},
                                {value:80, name:'Computer'},
                                {value:100, name:'Product Detail'}
                            ]
                        }
                    ]
                },
                pieChartOption : {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient : 'vertical',
                        x : 'left',
                        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    toolbox: {
                        show : false
                    },
                    calculable : true,
                    series : [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ]
                        }
                    ]
                }
            };

            initMainChart('./data/demo.json');

            // init the main chart
            function initMainChart(request) {
                $.getJSON(request, function(json){
                    exGraph.mainChartOption.series[0].nodes = json.nodes;
                    exGraph.mainChartOption.series[0].links = json.links;
                    exGraph.mainChart.setOption(exGraph.mainChartOption);
                    exGraph.mainChart.on(exGraph.ecConfig.EVENT.CLICK, mainChartClickHandler);
                });
            }

            /**
             * response to the click event on the main chart
             * @param param
             */
            function mainChartClickHandler(param) {
                var data = param.data;
                var nodes = exGraph.mainChartOption.series[0].nodes;
                if (
                    data.source !== undefined && data.target !== undefined
                ) {
                    //setup for edges
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
                } else {
                    //setup for nodes
                    console.log("选中了" + data.name + '(' + data.value + ')');
                    refreshDetailChart('./data/search.json', data.name);
                    refreshConversationFunnel();
                    refreshDistributionPie();
                }
            }

            /**
             *
             * @param request the file you want to get from server
             * @param name the node name
             */
            function refreshDetailChart(request, name) {
                $.getJSON(request, function(json){
                    if(json[name]){
                        exGraph.detailChartOption.series[0].nodes = json[name].nodes;
                        exGraph.detailChartOption.series[0].links = json[name].links;
                        exGraph.detailChart.setOption(exGraph.detailChartOption);
                        exGraph.detailChart.on(exGraph.ecConfig.EVENT.FORCE_LAYOUT_END);
                    }
                });
            }

            function refreshConversationFunnel() {
                exGraph.funnelChart.setOption(exGraph.funnelChartOption);
            }

            function refreshDistributionPie() {
                exGraph.pieChart.setOption(exGraph.pieChartOption);
            }

        }
    )

})(this.jQuery);