/**
 * Created by Weiwei on 2015/1/26.
 */

(function($) {
    // DOM Element
    var insightBtn      = $("#insight-button");
    var insightForm     = $('#insight-form');

    var modelImageList  = $('#model-image-list');

    var modelImageArr   = $('#model-image-list div img');
    var tooltipPanel    = $('#tooltip-panel');


    // Event binding
    insightBtn.click(insightClickHandler);

    modelImageArr.on('mouseover', modelImageOverHandler)
        .on('mouseout', modelImageOutHandler);

    tooltipPanel.on('mouseover', tooltipOverHandler)
        .on('mouseout', tooltipOutHandler);


    // Event Handler
    function modelImageOverHandler(e) {
        var position    = $(this).offset();
        var ycoord      = position.top;
        var xcoord      = 0;
        if(position.left / $(window).width() >= 0.5) {
            xcoord = position.left - 530;
        } else {
            xcoord = position.left;
        }

        console.log('mouse over '+ xcoord + "," +ycoord);

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

        modelImageList.empty(); // Empty all children

        if (type !== undefined) {
            if (type === "website") {
                modelList = ["pie", "snake", "chord", "force"];

                var i = 0;
                for (; i < modelList.length; i++) {
                    console.log(modelList[i]);
                    modelImageList.append('<div class="col-md-3"><img src="../images/' + modelList[i] + '.png" class="img-rounded"></div>');
                }
            } else if (type === "flow") {
                modelList = ["force", "line", "chord", "snake"];
                var i = 0;
                for (; i < modelList.length; i++) {
                    console.log(modelList[i]);
                    modelImageList.append('<div class="col-md-3"><img src="../images/' + modelList[i] + '.png" class="img-rounded"></div>');
                }
            }
        }


        //console.log(vars);
    }

    // Add-on: auto-complete
    $.get('../data/suggestion_data.json', function (data) {
        $("#search-input").typeahead({source: data});
        $('#tooltip-input').typeahead({source: data});
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