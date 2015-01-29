/**
 * Created by Weiwei on 2015/1/26.
 */

(function($) {

    var sampleTags = ['apple phone', 'apple company', 'iphone'];

    // DOM Element
    var insightBtn      = $("#insight-button");
    var insightForm     = $('#insight-form');

    var modelSelBtn     = $('#model-selection-button');

    var modelImageList  = $('#model-image-list');

    var modelImageArr   = $('#model-image-list div img');
    var tooltipPanel    = $('#tooltip-panel');


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


    // Event Handler
    function modelImageOverHandler(e) {
        var e = e.toElement || e.relatedTarget; // Get DOM element e.g. <img />
        console.log(e.getAttribute('alt'));
        //var tooltipTag = '<li>'+ e.getAttribute('alt')+'</li>';
        //$('#tooltip-tags').html('').append(tooltipTag);

        var position    = $(this).offset();
        var ycoord      = position.top;
        var xcoord      = 0;
        if(position.left / $(window).width() >= 0.5) {
            xcoord = position.left - 530;
        } else {
            xcoord = position.left;
        }
        tooltipPanel.css({ 'left': xcoord, 'top': ycoord, 'display': 'block'});
    }

    function modelImageOutHandler(e) {
        tooltipPanel.css('display','none');
    }

    function tooltipOverHandler(e) {
        $(this).css('display','block');
    }

    function tooltipOutHandler(e) {
        var e = e.toElement || e.relatedTarget;
        if (e.parentNode == this || e.parentNode.parentNode == this || e.parentNode.parentNode.parentNode == this
            || e == this || e.nodeName == 'IMG') {
            return;
        }
        $(this).css('display','none');
    }

    function insightClickHandler() {
        var vars = getParams(insightForm);
        var type = vars['search-input'];
        var modelList = [];
        var i = 0;

        modelImageList.empty(); // Empty all children

        if (type !== undefined) {
            if (type.match(/website/)) {
                modelList = ["pie", "snake", "chord", "force"];
            } else if (type.match(/flow/)) {
                modelList = ["force", "line", "chord", "snake"];

            } else if (type.match(/^http/)) {
                modelList = ["heatmap"];
            }

            for (i=0; i< modelList.length; i++) {
                modelImageList.append('<div class="col-md-3"><a href="../pages/detail.html?modelType='+
                modelList[i]+'"><img src="../images/' + modelList[i] + '.png" class="img-rounded" alt="'+modelList[i]+'"></a></div>');
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

    // Add-on: auto-complete
    $.get('../data/suggestion_data.json', function (data) {
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

})(this.jQuery);