/**
 * Created by Weiwei on 2015/1/26.
 */

(function($) {
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
            var mainViewer      = document.getElementById('main-viewer');

            var clickedItem     = $('#clicked-item-input');
            var modelList       = $('#model-list li a');

            var furtherAnalysisForm = $('#further-analysis-form');
            var furtherAnalysisOkBtn = $('#further-analysis-ok-btn');

            // Graph Parameters
            var ecGraph = {
                ecConfig    : require('echarts/config'),
                mainViewer  : ec.init(mainViewer),

                pieOption   : {
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
                },
                barOption : {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['导航流量','产品流量']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'导航流量',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name:'产品流量',
                            type:'bar',
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                            markPoint : {
                                data : [
                                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name : '平均值'}
                                ]
                            }
                        }
                    ]
                }
            };


            // Application logic
            function appReady() {

                //todo: init the analysis demo
                getAnalysisResult();

            }

            // Application logic detail
            function getAnalysisResult() {
                ecGraph.mainViewer.setOption(ecGraph.pieOption, {notMerger: true});
                ecGraph.mainViewer.on(ecGraph.ecConfig.EVENT.CLICK, mainViewerClickHandler);
            }

            function refreshAnalysisResult(type) {
                if(type === 'pie') {
                    ecGraph.mainViewer.setOption(ecGraph.pieOption, {notMerger: true});
                } else if(type === 'bar') {
                    ecGraph.mainViewer.setOption(ecGraph.barOption, {notMerger: true});
                } else if(type === 'force') {

                } else {

                }
                ecGraph.mainViewer.on(ecGraph.ecConfig.EVENT.CLICK, mainViewerClickHandler);
            }

            // Event Binding
            modelList.each(function(){
                $(this).click(modelSelectHandler);
            });

            furtherAnalysisOkBtn.click(faOkHandler);

            // Event Handler

            function mainViewerClickHandler(param) {
                var data = param.data;
                console.log("You click the "+ data.name);
                clickedItem.val(data.name);
            }

            function modelSelectHandler(param) {
                var data = $(this).attr('name');
               refreshAnalysisResult(data);
            }

            function faOkHandler() {
                var faFromContent = furtherAnalysisForm.serialize();
                console.log(faFromContent);
            }


            // Execution logic
            appReady(); // application startup
        }
    )
})(this.jQuery);