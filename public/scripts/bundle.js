(function(){
    function classReg( className ) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ( 'classList' in document.documentElement ) {
        hasClass = function( elem, c ) {
            return elem.classList.contains( c );
        };
        addClass = function( elem, c ) {
            elem.classList.add( c );
        };
        removeClass = function( elem, c ) {
            elem.classList.remove( c );
        };
    }
    else {
        hasClass = function( elem, c ) {
            return classReg( c ).test( elem.className );
        };
        addClass = function( elem, c ) {
            if ( !hasClass( elem, c ) ) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function( elem, c ) {
            elem.className = elem.className.replace( classReg( c ), ' ' );
        };
    }

    function toggleClass( elem, c ) {
        var fn = hasClass( elem, c ) ? removeClass : addClass;
        fn( elem, c );
    }

    var classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };



    // On scroll animations

    var timeBetween = 100;
    var position = 0.9;
    var views = [];
    var viewsByElem = {};
    var viewables = [];
    var ticking = false;
    var showing = false;
    var windowHeight = window.innerHeight;
    var scrollTop = getScrollTop();
    var lastTime = Date.now();

    function defereScroll(){
        if(!ticking)
            { window.requestAnimationFrame(scroll); }
        ticking = true;
    }

    function getScrollTop(){
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    function scroll(){
        //console.log('scroll');
        ticking = false;
        scrollTop = getScrollTop();
        var height = windowHeight * position;
        for(var i = views.length-1; i>=0; i--){
            var view = views[i];
            if(view.top - height - scrollTop < 0){
                viewables.push(view);
                views.splice(i, 1);
            }
        }

        if(showing == false && viewables.length > 0)
            { window.requestAnimationFrame(show); }
    }

    function sortByTop(a, b){
        var atop = Math.abs(a.top - scrollTop);
        var btop = Math.abs(b.top - scrollTop);
        if(atop < btop)
            { return -1; }
        if(atop > btop)
            { return 1; }
        return 0;
    }

    function resize(){
        //console.log('resize');
        windowHeight = window.innerHeight;
        scrollTop = getScrollTop();
        for(var i = views.length-1; i>=0; i--){
            var view = views[i];
            view.top = view.elem.getBoundingClientRect().top + scrollTop;
        }
    }

    function show(){
        //console.log('show');
        showing = true;
        var now = Date.now();
        if(now - lastTime > timeBetween){
            //console.log(now - lastTime);
            viewables.sort(sortByTop);
            var view = viewables.shift();
            classie.add(view.elem, 'showed');
            if(view.callback !== null && typeof view.callback == 'function')
                { view.callback.call(view.elem); }
            lastTime = now;
        }

        if(viewables.length == 0)
            { showing = false; }
        else
            { window.requestAnimationFrame(show); }
    }

    function on(elem, fn){
        if(viewsByElem[elem])
            { viewsByElem[elem].callback = fn; }
    }

    function init(selectors){
        selectors = [].concat(selectors);
        selectors.push('[data-show]');
        var elem = document.querySelectorAll(selectors.join(' '));
        for(var i = 0, l = elem.length; i<l; i++){
            var view = {
                top: 0,
                elem: elem[i],
                callback: null
            };
            views.push(view);
            viewsByElem[elem[i]] = view;
        }

        var images = document.querySelectorAll('img');
        for(var j = 0, lj = images.length; j<lj; j++)
            { images[j].addEventListener('load', resize); }
        window.addEventListener('resize', resize, false);
        window.addEventListener('scroll', defereScroll, false);
        resize();
        scroll();
    }

    window.SCROLLSHOW = {
        init: init,
        on: on
    };

    init();


})();
