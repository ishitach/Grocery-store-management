// JavaScript source code

(function () {
    function changeAll(a, b) {
        var x = this;
        while (x.indexOf(a) !== -1) {

            x = x.replace(a, b);
        }
        return x;
    }
    if (typeof String.prototype.changeAll === 'undefined')
        String.prototype.changeAll = changeAll;

})();

