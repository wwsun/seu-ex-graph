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
            'echarts/chart/line'
        ],
        function (ec) {

            // Model predication dialog
            //var dialog;

            // DOM Elements
            var mainViewer = document.getElementById('main-viewer');
            var sideViewer = document.getElementById('sidebar-content');

            var furtherTitle = $('#further-analysis-panel-header');
            var modelList = $('#model-list li a');

            var furtherAnalysisForm = $('#further-analysis-form');
            var furtherAnalysisOkBtn = $('#further-analysis-ok-btn');

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
                var returnData = {
                    legendData: [paramX, paramY],
                    seriesData: []
                };

                operationHistory = [];
                operationHistory.push(model);

                $('#sidebar').hide(); // Hide the sidebar
                $('#sidebar-tip').hide();  // Hide the sidebar-tip

                // TODO: query from database (x, y)

                if (model === 'heatmap') {
                    console.log(">>>"+model);
                    setGraphModel(model, null);
                } else {
                    $.getJSON('../data/demo-model.json',function (json) {

                        localStorage.setItem('currentData',JSON.stringify(json['result2']));//store data for bar graph

                        returnData.seriesData = json['result'];

                        if (model !== undefined) {
                            setGraphModel(model, returnData);
                        } else {
                            console.log("No model!!!");
                        }
                    })
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

            //dialog = $("#dialog-form").dialog({
            //    autoOpen: false,
            //    height: 300,
            //    width: 280,
            //    modal: true,
            //    close: function() {
            //        form[0].rest();
            //    },
            //    buttons: {
            //        "Sure": function(){},
            //        Cancel: function(){dialog.dialog('close')}
            //    }
            //});
            //
            //$('#next-model-tip').button().on('click', function(e) {
            //    dialog.dialog('open');
            //});



            // Event Handler

            function mainViewerClickHandler(param) {
                var data = param.data;

                if(data.name === undefined) {
                    if (confirm("Refresh the data from another perspective?")) {
                        localStorage.setItem('refresh', true);
                        refreshMainViewer();
                        setSidebarPanel();  //display sidebar
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
        }
    )
})(this.jQuery);