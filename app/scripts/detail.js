/**
 * Created by Weiwei on 2015/1/26.
 */

(function ($) {
    require(
        [
            'echarts',
            'echarts/chart/force',
            'echarts/chart/chord',
            'echarts/chart/funnel',
            'echarts/chart/pie',
            'echarts/chart/bar',
            'echarts/chart/gauge',
            'echarts/chart/line',
            'echarts/chart/map'
        ],
        function (ec) {
            // Model predication dialog
            //var dialog;

            // DOM Elements
            var mainViewer = document.getElementById('main-viewer');
            var sideViewer = document.getElementById('sidebar-content');

            var furtherTitle = $('#further-analysis-panel-header');
            var modelList = $('#model-list li a');

            // Graph Parameters
            var ecGraph = {
                ecConfig: require('echarts/config'),
                mainViewer: ec.init(mainViewer),
                sideViewer: ec.init(sideViewer),

                pieOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    toolbox: {
                        show: false
                    },
                    calculable: true,
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: [
                                {value: 335, name: '直接访问'},
                                {value: 310, name: '邮件营销'},
                                {value: 234, name: '联盟广告'},
                                {value: 135, name: '视频广告'},
                                {value: 1548, name: '搜索引擎'}
                            ]
                        }
                    ]
                },
                barOption: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['avg product', 'avg category']
                    },
                    toolbox: {
                        show: false
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category'
                            //data: ['China', 'Japan', 'USA', 'France']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: 'avg product',
                            type: 'bar',
                            data: [500, 400, 600, 400]
                        },
                        {
                            name: 'avg category',
                            type: 'bar',
                            data: [600, 800, 200, 600]
                        }
                    ]
                },
                forceOption: {
                    title : {
                        text: 'Relationship Graph',
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
                gaugeOption: {
                    tooltip : {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                        show : false
                    },
                    series : [
                        {
                            name:'个性化仪表盘',
                            type:'gauge',
                            center : ['50%', '50%'],    // 默认全局居中
                            radius : [0, '75%'],
                            startAngle: 140,
                            endAngle : -140,
                            min: 0,                     // 最小值
                            max: 100,                   // 最大值
                            precision: 0,               // 小数精度，默认为0，无小数点
                            splitNumber: 10,             // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                show: true,        // 默认显示，属性show控制显示与否
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.2, 'lightgreen'],[0.4, 'orange'],[0.8, 'skyblue'],[1, '#ff4500']],
                                    width: 30
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                show: true,        // 属性show控制显示与否，默认不显示
                                splitNumber: 5,    // 每份split细分多少段
                                length :8,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: '#eee',
                                    width: 1,
                                    type: 'solid'
                                }
                            },
                            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                show: true,
                                formatter: function(v){
                                    switch (v+''){
                                        case '10': return 'Negative';
                                        case '30': return 'Low';
                                        case '60': return 'Mid';
                                        case '90': return 'Positive';
                                        default: return '';
                                    }
                                },
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: '#333'
                                }
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length :30,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: '#eee',
                                    width: 2,
                                    type: 'solid'
                                }
                            },
                            pointer : {
                                length : '80%',
                                width : 8,
                                color : 'auto'
                            },
                            title : {
                                show : true,
                                offsetCenter: ['-65%', -10],
                                textStyle: {
                                    color: '#333',
                                    fontSize : 15
                                }
                            },
                            detail : {
                                show : true,
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderWidth: 0,
                                borderColor: '#ccc',
                                width: 100,
                                height: 40,
                                offsetCenter: ['-60%', 10],
                                formatter:'{value}%',
                                textStyle: {
                                    color: 'auto',
                                    fontSize : 30
                                }
                            },
                            data:[{value: 50, name: 'Sentiment Analysis'}]
                        }
                    ]
                },
                mapOption: {
                    title : {
                        text: 'Flow Distribution',
                        subtext: 'Calculated based on the session distribution.',
                        x:'center',
                        y:'top'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter : function (params) {
                            var value = (params.value + '').split('.');
                            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                            return params.name + ' : ' + value;
                        }
                    },
                    toolbox: {
                        show : true,
                        orient : 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    dataRange: {
                        min: 0,
                        max: 73000,
                        text:['High','Low'],
                        realtime: false,
                        calculable : true,
                        color: ['orangered','yellow','lightskyblue']
                        //color: ['#EE0000','#EE5C42','#EEE685']

                    },
                    series : [
                        {
                            name: 'Flow Distribution',
                            type: 'map',
                            mapType: 'world',
                            roam: true,
                            mapLocation: {
                                y : 60
                            },
                            itemStyle:{
                                emphasis:{label:{show:true}}
                            }
                        }
                    ]
                }
            };

            var operationHistory = [];

            // Application logic
            function appReady() {

                // 1. get the init model
                // 2. get the further analysis target
                // 3. refresh the current model
                setInitModel();
                // TODO: 3. refresh the current model & add the latest model to the history list

            }

            // Application logic detail
            function setInitModel() {
                var vars = getUrlParams();
                var model = vars['model'],
                    paramX = vars['x'],
                    paramY = vars['y'];

                // TODO: refactor the 'returnData' to the new 'resultData'

                var returnData = {
                    legendData: [paramX, paramY],
                    seriesData: []
                };

                var analysisType = localStorage.getItem("analysisType");

                // New returnData
                var resultData = {
                    model: model,
                    type: analysisType,
                    col: 1,
                    legendData: [],
                    xAxis: [],
                    series1: [],
                    series2: []
                };

                operationHistory = [];
                operationHistory.push(model);

                $('#sidebar').hide(); // Hide the sidebar
                $('#sidebar-tip').hide();  // Hide the sidebar-tip

                // TODO: query from database (x, y)


                if (analysisType === 'website' && model === 'pie') {
                    $.getJSON('../data/demo-model.json',function (json) {
                        localStorage.setItem('currentData',JSON.stringify(json['result2']));//store data for bar graph
                        returnData.seriesData = json['result'];
                        if (model !== undefined) {
                            setGraphModel(model, returnData);
                        } else {
                            console.log("No model!!!");
                        }
                    })
                } else if (analysisType === 'website' && model ==='tagcloud') {

                    $('#main-viewer').hide();
                    $('#main-viewer2').append('<canvas id="tag-cloud" height="400" width="600"></canvas>');

                    var list;
                    $.getJSON('../data/keyword.json', function(json) {
                        list = json['topKeywords'];
                        WordCloud(document.getElementById("tag-cloud"), {list:list});
                    });

                } else if (analysisType === 'website' && model === 'map') {
                    $.getJSON('../data/geo-full.json', function(json) {
                        ecGraph.mapOption.series[0].data = json;
                        ecGraph.mainViewer.setOption(ecGraph.mapOption);
                    });
                } else if (analysisType === 'website' && model === 'snake') {
                    $('#main-viewer').hide();
                    drawSnakeGraph();
                } else if (analysisType === 'url') {
                    setGraphModel(model, null);
                } else if (analysisType === 'product' && model === 'bar' ) {
                    resultData.col = 2;
                    resultData.legendData = ["iphone", "ipad"];
                    resultData.xAxis = ["Jan.","Feb","Mar.","Apr.","May.","June","July","Aug.","Sep.","Oct.","Nov.","Dec."];
                    resultData.series1 = [20, 49, 70, 232, 256, 767, 136, 162, 326, 200, 64, 33];
                    resultData.series2 = [26, 59, 90, 264, 287, 77, 176, 182, 487, 188, 60, 23];
                    setGraphModelNew(model, resultData);
                } else if (analysisType === 'product' && model === 'tagcloud') {
                    $('#main-viewer').hide();
                    $('#main-viewer2').append('<canvas id="tag-cloud" height="400" width="600"></canvas>');

                    var list;
                    $.getJSON('../data/search-engine.json', function(json) {
                        list = json['source'];
                        WordCloud(document.getElementById("tag-cloud"), {list:list});
                    });
                } else if (analysisType === 'figure' && model === 'force') {
                    $.getJSON('../data/relationship-graph.json', function(json){
                        ecGraph.forceOption.series[0].nodes = json['nodes'];
                        ecGraph.forceOption.series[0].links = json['links'];
                        ecGraph.mainViewer.setOption(ecGraph.forceOption);
                    });
                } else if (analysisType === 'figure' && model === 'sentiment') {
                    ecGraph.gaugeOption.series[0].data = [{value: 70, name: 'Sentiment Analysis'}];
                    ecGraph.mainViewer.setOption(ecGraph.gaugeOption);
                }
            }

            function refreshMainViewer() {
                var furtherModel = localStorage.getItem('furtherAnalysisModel'),
                    furtherData  = localStorage.getItem('furtherData'),
                    refresh      = localStorage.getItem('refresh'),  //typeof(refresh) === string
                    returnData   = {
                        legendData: ['avg product', 'avg category'],
                        seriesData: []
                    };

                operationHistory.push(furtherModel);

                // TODO: query from database (furtherData)

                $.getJSON('../data/further-model.json', function (json) {
                    returnData = json;

                    if(refresh === 'false'){
                        setGraphModel(furtherModel, returnData['countries']);
                    } else {
                        setGraphModel(furtherModel, returnData['region']);
                    }
                });

                // TODO: refresh the history panel
                setHistoryPanel();

                // TODO: reasoning and get the analysis result
                $('#sidebar-tip').show();
                $('#sidebar-tip-content').html('The eastern are more prudent than westerns on consuming! Especially the Japanese! ');
            }

            function setGraphModel(model, returnData) {
                if (model === 'pie') {
                    ecGraph.pieOption.legend.data = returnData.legendData;
                    ecGraph.pieOption.series[0].data = returnData.seriesData;
                    ecGraph.mainViewer.setOption(ecGraph.pieOption, {notMerger: true});
                    ecGraph.mainViewer.on(ecGraph.ecConfig.EVENT.CLICK, mainViewerClickHandler);
                } else if (model ==='bar') {
                    ecGraph.barOption.xAxis[0].data = returnData.names;

                    if (returnData['avgProduct'] === undefined) {
                        ecGraph.barOption.series[0].name = "Share";
                        ecGraph.barOption.series[0].data = returnData['seriesData'];
                        ecGraph.barOption.series[1] = {};
                    } else {
                        ecGraph.barOption.series[0].data = returnData['avgProduct'];
                        ecGraph.barOption.series[1].data = returnData['avgCategory'];
                    }

                    ecGraph.mainViewer.setOption(ecGraph.barOption, {notMerger: true});
                } else if (model == 'heatmap') {
                    $('#main-viewer').hide();
                    $('#main-viewer2').append('<img src="../images/heatmap-dmeo.jpg" width="700">');
                } else {

                }
            }

            // TODO: refactor and combine
            function setGraphModelNew(model, resultData) {
                if (model === 'bar') {

                    if (resultData.col === 1) {

                    } else if (resultData.col === 2) {
                        ecGraph.barOption.legend.data = resultData.legendData;
                        ecGraph.barOption.xAxis[0].data = resultData.xAxis;
                        ecGraph.barOption.series[0].name = resultData.legendData[0];
                        ecGraph.barOption.series[0].data = resultData.series1;
                        ecGraph.barOption.series[1].name = resultData.legendData[1];
                        ecGraph.barOption.series[1].data = resultData.series2;

                        ecGraph.mainViewer.setOption(ecGraph.barOption, {notMerger: true});
                        $('#logic-text').html('');
                    }
                }
            }

            function setHistoryPanel() {

                var analysisHistory = $('#analysis-history');

                analysisHistory.empty();
                for(var i=0; i < operationHistory.length - 1; i++){
                    analysisHistory.append('<div class="col-xs-2"><a href="#" class="thumbnail"><img src="../images/'+operationHistory[i]+
                    '.png" height="100"></a></div>');
                }
            }

            function setSidebarPanel() {

                $('#sidebar').show();

                // Set default model: pie

                var returnData = {
                    legendData: ["western", "eastern"],
                    seriesData: [
                        {value: 40, name:"eastern"},
                        {value: 60, name:"western"}
                    ]
                };
                ecGraph.pieOption.legend.data = returnData.legendData;
                ecGraph.pieOption.series[0].data = returnData.seriesData;
                ecGraph.sideViewer.setOption(ecGraph.pieOption, {notMerger: true});
            }

            // Event Binding
            modelList.each(function () {
                $(this).click(modelSelectHandler);
            });

            // Event Handler

            function mainViewerClickHandler(param) {
                var data = param.data;

                if(data.name === undefined) {
                    if (confirm("Refresh the data from another perspective?")) {
                        localStorage.setItem('refresh', true);
                        refreshMainViewer();
                        setSidebarPanel();  //display sidebar

                        // setup logic text
                        $('#logic-text').append('<li class="list-group-item">导航关注度超过产品关注度</li>' +
                        '<li class="list-group-item">东西方人关注行为差别</li>' +
                        '<li class="list-group-item">西方人流量远超东方人流量</li>');
                    }
                } else {
                    localStorage.setItem('refresh', false);
                    console.log("You click the " + data.name);
                    localStorage.setItem("furtherData", data.name);
                    $("#further-model-list").empty();

                    // TODO: get the predication model
                    $('#next-model-tip img').attr("src", "../images/bar.png"); // setup the predication icon to sidebar

                    $.getJSON('../data/model-graph.json', function (json) {

                        var result = json[data.name]['models'];

                        for (var i = 0; i < result.length; i++) {
                            $modelItem = $('<li class="media image-menu-item" name="'+result[i]+'"><a class="media-left" ' +
                            'href="#"><img src="../images/' + result[i] + '.png" width="70"></a><div class="media-body">' +
                            result[i] + ' Graph</div></li>');
                            $modelItem.click(furtherAnalysisHandler);
                            $("#further-model-list").append($modelItem);
                        }

                    });

                    furtherTitle.html("Further analysis for <strong>" + data.name + "</strong>");
                }
            }

            function furtherAnalysisHandler() {
                //var furtherModel = $(this).attr('name');
                localStorage.setItem('furtherAnalysisModel', $(this).attr('name'));

                // click the see the further analysis
                refreshMainViewer();
            }

            function modelSelectHandler(param) {
                var vars = getUrlParams();
                var paramX = vars['x'],
                    paramY = vars['y'];
                var returnData = {
                    names: [paramX, paramY],
                    seriesData: []
                };

                var model = $(this).attr('name');

                operationHistory.push(model);

                returnData.seriesData = JSON.parse(localStorage.getItem('currentData'))["seriesData"];
                console.log(returnData);
                setGraphModel(model, returnData);

            }

            // Execution logic
            appReady(); // application startup

            // Util functions
            function getUrlParams() {
                var vars = [], hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }


            // Demo: Snake Graph
            function drawSnakeGraph() {

                var formatNumber = d3.format(",.0f"),
                    format = function(d) { return formatNumber(d) + " TWh"; },
                    color = d3.scale.category20();

                var svg = d3.select("#chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var sankey = d3.sankey()
                    .nodeWidth(15)
                    .nodePadding(10)
                    .size([width, height]);

                var path = sankey.link();

                d3.json("../data/energy.json", function(energy) {

                    sankey
                        .nodes(energy.nodes)
                        .links(energy.links)
                        .layout(32);

                    var link = svg.append("g").selectAll(".link")
                        .data(energy.links)
                        .enter().append("path")
                        .attr("class", "link")
                        .attr("d", path)
                        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                        .sort(function(a, b) { return b.dy - a.dy; });

                    link.append("title")
                        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

                    var node = svg.append("g").selectAll(".node")
                        .data(energy.nodes)
                        .enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .call(d3.behavior.drag()
                            .origin(function(d) { return d; })
                            .on("dragstart", function() { this.parentNode.appendChild(this); })
                            .on("drag", dragmove));

                    node.append("rect")
                        .attr("height", function(d) { return d.dy; })
                        .attr("width", sankey.nodeWidth())
                        .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
                        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
                        .append("title")
                        .text(function(d) { return d.name + "\n" + format(d.value); });

                    node.append("text")
                        .attr("x", -6)
                        .attr("y", function(d) { return d.dy / 2; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", "end")
                        .attr("transform", null)
                        .text(function(d) { return d.name; })
                        .filter(function(d) { return d.x < width / 2; })
                        .attr("x", 6 + sankey.nodeWidth())
                        .attr("text-anchor", "start");

                    function dragmove(d) {
                        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
                        sankey.relayout();
                        link.attr("d", path);
                    }
                });
            }
        }
    )
})(this.jQuery);