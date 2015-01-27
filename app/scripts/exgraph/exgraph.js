/**
 * Created by Weiwei on 2015/1/26.
 */

(function() {
    var exgraph = function() {
        //todo: util function

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
    };
    window.Exgraph = exgraph;
}());