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

            // DOM Elements
            var mainViewer = document.getElementById('main-viewer');

            var furtherTitle = $('#further-analysis-panel-header');
            var modelList = $('#model-list li a');

            var furtherAnalysisForm = $('#further-analysis-form');
            var furtherAnalysisOkBtn = $('#further-analysis-ok-btn');

            // Graph Parameters
            var ecGraph = {
                ecConfig: require('echarts/config'),
                mainViewer: ec.init(mainViewer),

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

                // TODO: query from database (x, y)

                $.getJSON('../data/demo-model.json',function (json) {
                    returnData.seriesData = json['result'];
                    if (model !== undefined) {
                        setGraphModel(model, returnData);
                    } else {
                        console.log("No model!!!");
                    }
                })
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

            }

            function setGraphModel(model, returnData) {
                if (model === 'pie') {
                    ecGraph.pieOption.legend.data = returnData.legendData;
                    ecGraph.pieOption.series[0].data = returnData.seriesData;
                    ecGraph.mainViewer.setOption(ecGraph.pieOption, {notMerger: true});
                    ecGraph.mainViewer.on(ecGraph.ecConfig.EVENT.CLICK, mainViewerClickHandler);
                } else if (model ==='bar') {

                    console.log(returnData.names);
                    ecGraph.barOption.xAxis[0].data = returnData.names;
                    ecGraph.barOption.series[0].data = returnData['avgProduct'];
                    ecGraph.barOption.series[1].data = returnData['avgCategory'];
                    ecGraph.mainViewer.setOption(ecGraph.barOption, {notMerger: true});
                } else {

                }
            }

            function setHistoryPanel() {
                $('#analysis-history').empty();
                for(var i=0; i<operationHistory.length; i++){
                    $('#analysis-history').append('<img src="../images/'+operationHistory[i]+'.png" class="img-rounded" height="90">');
                }
            }

            // Event Binding
            modelList.each(function () {
                $(this).click(modelSelectHandler);
            });

            furtherAnalysisOkBtn.click(faOkHandler);

            // Event Handler

            function mainViewerClickHandler(param) {
                var data = param.data;

                if(data.name === undefined) {
                    if (confirm("Refresh the data from another perspective?")) {
                        localStorage.setItem('refresh', true);
                        refreshMainViewer();
                    }
                } else {
                    localStorage.setItem('refresh', false);
                    console.log("You click the " + data.name);
                    localStorage.setItem("furtherData", data.name);
                    $("#further-model-list").empty();
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
                var data = $(this).attr('name');
                // TODO: change current analysis view
            }

            function faOkHandler() {
                var faFromContent = furtherAnalysisForm.serialize();
                console.log(faFromContent);
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