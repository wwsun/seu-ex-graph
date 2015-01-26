/**
 * Created by Weiwei on 2015/1/26.
 */

(function($){
    // DOM Element
    var insightBtn      = document.getElementById("insight-button");

    var insightForm     = $('#insight-form');

    var modelImageList  = $('#model-image-list');

    // Add-on: auto-complete
    $.get('../data/suggestion_data.json', function(data){
        $("#search-input").typeahead({ source:data });
    },'json');



    // Application Logic
    insightBtn.onclick = function() {
        var vars = getParams(insightForm);
        var type = vars['search-input'];
        var modelList = [];

        modelImageList.empty(); // Empty all children

        if(type !== undefined) {
            if(type === "website") {
                modelList = ["pie", "snake","chord","force"];

                var i =0;
                for(;i<modelList.length;i++){
                    console.log(modelList[i]);
                    modelImageList.append('<div class="col-md-3"><img src="../images/'+modelList[i]+'.png" class="img-rounded"></div>');
                }
            } else if(type === "flow") {
                modelList = ["force", "line", "chord", "snake"];
                var i =0;
                for(;i<modelList.length;i++){
                    console.log(modelList[i]);
                    modelImageList.append('<div class="col-md-3"><img src="../images/'+modelList[i]+'.png" class="img-rounded"></div>');
                }
            }
        }

        console.log(vars);
    };



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

})(this.jQuery);