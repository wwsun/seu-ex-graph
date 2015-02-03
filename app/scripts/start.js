/**
 * Created by Weiwei on 2015/1/26.
 */

(function ($) {

    var sampleTags = ['apple phone', 'apple company', 'iphone',];
    var data = [
        "navigation",
        "product",
        "search",
        "browse"
    ];

    // DOM Element
    var insightBtn = $("#insight-button");
    var insightForm = $('#insight-form');

    var modelSelBtn = $('#model-selection-button');

    var modelImageList = $('#model-image-list');

    var modelImageArr = $('#model-image-list div img');
    var tooltipPanel = $('#tooltip-panel');


    // Event binding
    insightBtn.click(insightClickHandler);
    modelSelBtn.click(modelSelClickHandler);

    modelImageArr.on('mouseover', modelImageOverHandler)
        .on('mouseout', modelImageOutHandler);

    tooltipPanel.on('mouseover', tooltipOverHandler)
        .on('mouseout', tooltipOutHandler);


    $('#tooltip-tags').tagit({
        availableTags: sampleTags,
        singleField: true,
        singleFieldNode: $('#tooltip-tags-display')
    });

    $('#search-btn').on('click', searchClickHandler);

    // Event Handler
    function modelImageOverHandler(e) {
        var ele = e.toElement || e.relatedTarget; // Get DOM element e.g. <img />
        //console.log(e.getAttribute('alt'));
        localStorage.setItem("currentHoverItem", ele.getAttribute('alt')); //store hover information to localStorage

        var position = $(this).offset();
        var ycoord = position.top;
        var xcoord = 0;
        if (position.left / $(window).width() >= 0.5) {
            xcoord = position.left - 530;
        } else {
            xcoord = position.left;
        }
        tooltipPanel.css({'left': xcoord, 'top': ycoord, 'display': 'block'});
    }

    function modelImageOutHandler(e) {
        tooltipPanel.css('display', 'none');
    }

    function tooltipOverHandler(e) {
        $(this).css('display', 'block');
    }

    function tooltipOutHandler(e) {
        var e = e.toElement || e.relatedTarget;
        if (e.parentNode == this || e.parentNode.parentNode == this || e.parentNode.parentNode.parentNode == this
            || e == this || e.nodeName == 'IMG') {
            return;
        }
        $(this).css('display', 'none');
        $('#result-list').html('');
    }

    function insightClickHandler() {
        var vars = getParams(insightForm);
        var type = vars['search-input'];
        var modelList = [];
        var i = 0;

        modelImageList.empty(); // Empty all children

        if (type !== undefined) {
            if (type.match(/website/)) {
                modelList = ["pie", "tagcloud", "force", "snake"];
                localStorage.setItem("analysisType","website");
            } else if (type.match(/flow/)) {
                modelList = ["force", "line", "chord", "snake"];
                localStorage.setItem("analysisType","flow");
            } else if (type.match(/^http/)) {
                modelList = ["heatmap"];
                localStorage.setItem("analysisType","url");
            } else if (type.match(/apple/)) {
                modelList = ["bar", "tagcloud", "pie"];
                localStorage.setItem("analysisType","product");
            } else if (type.match(/jobs/)) {
                modelList = ["force","pie",  "chord"];
                localStorage.setItem("analysisType", "figure")
            }

            // TODO: match person name

            for (i = 0; i < modelList.length; i++) {
                modelImageList.append('<div class="col-md-3"><a href="pages/detail.html?model=' +
                modelList[i] + '"><img src="images/' + modelList[i] + '.png" class="img-rounded" alt="' + modelList[i] + '"></a></div>');
            }

            // Re-binding the mouse hover event
            $('#model-image-list div').on('mouseover', modelImageOverHandler)
                .on('mouseout', modelImageOutHandler);
        }


        //console.log(vars);
    }

    function modelSelClickHandler(e) {
        //var e = e.toElement || e.relatedTarget;
    }

    /**
     * GOOD LUCK: fuzzy query
     * @param e
     */
    function searchClickHandler(e) {
        var searchStrArr = $('#tooltip-tags-display').val().split(',');
        var tempArr = [];
        var result = new Array();
        var resultStr = '';

        for (var k = 0; k < searchStrArr.length; k++) {

            var searchStr = searchStrArr[k];

            for (var i = 0; i < data.length; i++) {
                tempArr[i] = [];
                tempArr[i].push(getSentenceLength(searchStr, data[i]));
                tempArr[i].push(data[i]);
            }

            result[k] = tempArr.sort(function (a, b) {
                return a[0] - b[0];
            });
            tempArr = [];

        }

        for (var j = 0; j < result[0].length; j++) {
            var paramX = result[0][j][1],
                paramY = result[1][j][1];
            var currentModel = localStorage.getItem('currentHoverItem');
            if(paramX !== paramY) {
                resultStr += '<a class="list-group-item" href="pages/detail.html?model='+currentModel+'&x='+paramX+'&y='+paramY
                +'">你指的是 <strong>' + paramX + '</strong>, <strong>' + paramY + '</strong> 吗？</a>';
            }
        }

        $('#result-list').html(resultStr);
    }

    // Add-on: auto-complete
    $.get('data/suggestion_data.json', function (data) {
        $("#search-input").typeahead({source: data});
    }, 'json');

    /**
     * Read a page's GET URL variables and return them as an associative array.
     * @returns {Array}
     */
    function getParams(form) {
        var formContent = form.serialize();
        var vars = [], hash;
        var hashes = formContent.split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function getSentenceLength(a, b) {

        var al = a.length + 1;
        var bl = b.length + 1;
        var result = [];
        var temp = 0;

        for (var i = 0; i < al; result[i] = [i++]) {
        }
        for (var i = 0; i < bl; result[0][i] = i++) {
        }

        for (i = 1; i < al; i++) {
            for (var j = 1; j < bl; j++) {
                temp = a[i - 1] == b[j - 1] ? 0 : 1;
                result[i][j] = Math.min(result[i - 1][j] + 1, result[i][j - 1] + 1, result[i - 1][j - 1] + temp);
            }
        }

        return result[i - 1][j - 1];
    }

})(this.jQuery);