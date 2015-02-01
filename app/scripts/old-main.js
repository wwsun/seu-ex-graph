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

            var DEFAULTS = {
                vis  : 'force',
                ana  : 'link',
                xAxis: 'navigation',
                yAxis: 'product'
            };

            // DOM Elements
            var mainArea        = document.getElementById('main-area');
            var detailCenter    = document.getElementById('detail-funnel');
            var detailDown      = document.getElementById('detail-pie');
            var refreshButton   = document.getElementById('refresh');
            var closeButton     = document.getElementById('detailPanelCloseBtn');
            var detailButton    = document.getElementById('refreshDetailBtn');

            var toolbarForm     = $('#toolbar-form');
            var detailForm      = $('#detail-form');
            var analysisSelect  = $('#analysis-model');
            var graphSelect     = $('#graph-model');

            var childPanel      = $('#detail-area');
            var childPanelTitle = $('#child-panel-title');

            var exGraph = {
                ecConfig : require('echarts/config'),

                //chart
                mainChart           : ec.init(mainArea),
                //detailUpChart       : ec.init(detailUpper),
                detailCenterChart   : ec.init(detailCenter),
                detailDownChart     : ec.init(detailDown),

                // chart option
                forceChartOption    : {
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
                        //'#996699', '#9999CC', '#CCCCFF'
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
                // todo: one type one option
                detailChartOption   : {
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
                },  // it is also a force chart for detail
                funnelChartOption   : {
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
                pieChartOption      : {
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

            // App startup
            appReady();


            /**
             * Application execution logic
             */
            function appReady() {
                // init the menu
                initMenu();

                // init with a default graph in the main area
                initMainChart('./data/demo.json');

                // get parameters
                var vars = getParams(toolbarForm);

                // todo: refresh the graph
                refreshGraph(vars);

                // todo: wait for the user commands and handle them
            }

            function initMenu() {

                // first level
                for (var item in MENU.analysisModel) {
                    analysisSelect.append('<option value="'+item+'">'+item+'</option>');
                }

                analysisSelect.change(function() {
                    graphSelect.empty();
                    var analysisModel = analysisSelect.val();
                    var graphList = MENU.analysisModel[analysisModel].type;

                    // second level
                    for (var i= 0; i<graphList.length; i++) {
                        graphSelect.append('<option value="'+graphList[i]+'">'+graphList[i]+'</option>');
                    }
                });

                childPanel.hide();
            }

            /**
             * Refresh the main chart based on the user's choice
             * @param vars the parameter array
             */
            function refreshGraph(vars) {

                var type    = vars.vis,
                    model   = vars.ana,
                    paramX  = vars.x,
                    paramY  = vars.y,
                    date    = vars.date;

                // choose a graph
                if(type==='force') {
                    initMainChart('./data/demo.json');
                } else if(type==='pie') {
                    // todo: binding graph with test data

                    if(model==='flow') {
                        exGraph.pieChartOption.legend.data = [paramX, paramY];
                        exGraph.pieChartOption.series[0].data = [{value:100, name:paramX}, {value:200, name:paramY}];
                    }

                    // todo: binding graph with option
                    exGraph.mainChart.setOption(exGraph.pieChartOption, {notMerger: true});
                } else if(type==='funnel') {

                    exGraph.mainChart.setOption(exGraph.funnelChartOption, {notMerger: true});
                }
            }

            function getNewGraph() {
                // todo: move main graph to the smaller area


                // todo: generate the new graph
            }

            /**
             * Read a page's GET URL variables and return them as an associative array.
             * @returns {Array}
             */
            function getParams(form) {
                var formContent = form.serialize();
                var vars = [], hash;
                var hashes = formContent.split('&');
                for (var i= 0; i<hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }

            refreshButton.onclick = function() {
                var vars = getParams(toolbarForm);
                refreshGraph(vars);
            };

            closeButton.onclick = function() {
                childPanel.hide();
            };

            detailButton.onclick = function() {
                var vars = getParams(detailForm);
                refreshDetailChart(vars);
            };



            /**
             * init the main chart
             * @param request the file you want to request
             */
            function initMainChart(request) {
                $.getJSON(request, function(json){
                    exGraph.forceChartOption.series[0].nodes = json.nodes;
                    exGraph.forceChartOption.series[0].links = json.links;
                    exGraph.mainChart.setOption(exGraph.forceChartOption, {notMerger:true});
                    exGraph.mainChart.on(exGraph.ecConfig.EVENT.CLICK, mainChartClickHandler);
                });
            }

            /**
             * response to the click event on the main chart
             * @param param
             */
            function mainChartClickHandler(param) {
                var data = param.data;
                var nodes = exGraph.forceChartOption.series[0].nodes;
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

                    childPanel.show();
                    childPanelTitle.html("Choose a new analysis model for node <b>" + data.name +"</b>");
                    //childPanel.toggle();
                    //refreshDetailChart('./data/search.json', data.name);
                    //refreshConversationFunnel();
                    //refreshDistributionPie();
                }
            }

            function refreshDetailChart(vars) {
                var type = vars.newAnalysisModel,
                    newX = vars.newXAxis,
                    newY = vars.newYAxis;
                console.log(type);

                if(type === 'funnel') {
                    exGraph.detailCenterChart.setOption(exGraph.funnelChartOption, {notMerger: true});
                } else if(type === 'pie') {
                    exGraph.detailCenterChart.setOption(exGraph.pieChartOption, {notMerger: true})
                }
            }

            // todo: public function, which used to build the analysis model
            function buildAnalysisModel(vars) {
                var type  = vars.analysisModel,
                    xAxis = vars.xAxis,
                    yAxis = vars.yAxis;

                if( type!== undefined && xAxis !== undefined && yAxis !== undefined ){
                    if(type == 'force') {
                        // todo:
                    } else if(type == 'pie') {
                        // todo:
                    }



                }

            }

        }
    )

})(this.jQuery);