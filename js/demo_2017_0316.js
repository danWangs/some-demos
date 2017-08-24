/**
 * Created by wd on 2017/3/16.
 */
function waterfall(parent, sclass) {
    var oParent = document.getElementById(parent);
    var aBox = document.getElementsByClassName(sclass);
    var boxwidth = aBox[0].offsetWidth+4;
    var documentwidth = document.documentElement.clientWidth;
    var cnum = Math.floor(documentwidth/boxwidth);
    oParent.style.width = boxwidth * cnum + 'px';
    var aBoxHeight = new Array();
    for(var i = 0; i < aBox.length; i++) {
        if(i < cnum) {
            aBox[i].style.top = 0 + 'px';
            aBox[i].style.left = boxwidth * i + 'px';
            aBoxHeight.push(aBox[i].offsetHeight);
        }
        else {
            var minHeight = Math.min.apply(null,aBoxHeight);
            var minIndex = getIndex(aBoxHeight,minHeight);
            aBox[i].style.position='absolute';
            aBox[i].style.top = minHeight +'px';
            aBox[i].style.left = aBox[minIndex].offsetLeft + 'px';
            aBoxHeight[minIndex] += aBox[i].offsetHeight;
        }
    }
}
function getIndex(arr,value){
    for(var i in arr){
        if(arr[i] == value) return i;
    }
}
window.onload = function(){
    waterfall('main','box');
} 