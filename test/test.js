var jsdom = require('mocha-jsdom');
var expect = require('chai').expect
var assert = require('chai').assert

var compare = function( $m, $j ) {
    var same = true;
    $m.each(function(i){
        if( !this.isEqualNode($j[i]) ) {
            same = false;
        }
    });
    if( $m.length !== $j.length ) {
        same = false;
    }
    return same;
}

describe('$()', function() {

    var $, jquery
    jsdom()

    before(function ( done ) {
        $ = require('../mquery.js');
        jquery = require('jquery');
        done();
    })

    it('should be able to create an empty instance', function () {
        var $elem = $();
        assert.instanceOf($elem, $.fn.init);
        assert.lengthOf($elem, 0);
    })

    it('should be able to create from dom element', function () {
        var $elem = $(document.createElement('div'));
        assert.instanceOf($elem, $.fn.init);
        assert.lengthOf($elem, 1);
    })


    it('should be able to create from query string', function () {
        document.body.innerHTML = '<ul><li></li><li></li><li></li></ul>';
        var $elems = $('li');
        assert.instanceOf($elems, $.fn.init);
        assert.lengthOf($elems, 3);
    })

    it('should be able to create from another instance', function () {
        var $elem1 = $(document.createElement('div'));
        var $elem2 = $($elem1);
        assert.instanceOf($elem2, $.fn.init);
        assert.lengthOf($elem2, 1);
    })

    it('should produce the same results as jquery', function () {
        document.body.innerHTML = '<ul><li></li><li></li><li></li></ul>';
        assert.isTrue( compare($('li'),jquery('li')) );
    })

})

describe('add()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return new instance with added elements', function () {
        document.body.innerHTML = '<h1></h1><p></p>';
        var $elems1 = $('h1');
        var $elems2 = $elems1.add( $('p') );
        assert.lengthOf($elems1, 1);
        assert.lengthOf($elems2, 2);
    })

    it('should not add element to current instance', function () {
        document.body.innerHTML = '<h1></h1><p></p>';
        var $elems = $('h1');
        $elems.add( $('p') );
        assert.lengthOf($elems, 1);
    })

    it('should be able to add from node list', function () {
        document.body.innerHTML = '<div></div><div></div>';
        var elems = document.querySelectorAll('div');
        var $elems = $().add(elems);
        assert.lengthOf($elems, 2);
    })

    it('should be able to add from another instance', function () {
        document.body.innerHTML = '<div></div><div></div>';
        assert.lengthOf($().add( $('div') ), 2);
    })

})

describe('addClass()', function() {

    var $, $elems
    jsdom()

    before(function () {
        $ = require('../mquery.js');
        document.body.innerHTML = '<div></div><div></div>';
        $elems = $('div');
    })

    it('should add a class to an element', function () {
        $elems.addClass('foo');
        assert.match($elems[0].className, /foo/);
    })

    it('should not add a class which already exists', function () {
        $elems.addClass('foo');
        assert.lengthOf($elems[0].className.split(' '), 1);
    })

    it('should add class to all elements in the set', function () {
        assert.match($elems[0].className + $elems[1].className, /foofoo/);
    })

})

describe('hasClass()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return true if class exists', function () {
        document.body.innerHTML = '<div class="foo"></div>';
        assert.isTrue($('div').hasClass('foo'));
    })

    it('should return false if class doesn\'t exists', function () {
        document.body.innerHTML = '<div class="foo"></div>';
        assert.isFalse($('div').hasClass('bar'));
    })

    it('should work with multiple classes present', function () {
        document.body.innerHTML = '<div class="foo bar"></div>';
        assert.isTrue($('div').hasClass('bar'));
        assert.isFalse($('div').hasClass('barf'));
    })

    it('should work when no classes are present', function () {
        document.body.innerHTML = '<div></div>';
        assert.isFalse($('div').hasClass('foo'));
    })

})

describe('removeClass()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should remove a class from an element', function () {
        document.body.innerHTML = '<div class="foo"></div>';
        var $elem = $('div');
        assert.match($elem[0].className, /foo/);
        $elem.removeClass('foo');
        assert.lengthOf($elem[0].className, 0);
    })

    it('should only remove the class given', function () {
        document.body.innerHTML = '<div class="foo bar"></div>';
        var $elem = $('div');
        assert.match($elem[0].className, /foo bar/);
        $elem.removeClass('foo');
        assert.match($elem[0].className, /bar/);
    })

    it('should remove class from all elements in the set', function () {
        document.body.innerHTML = '<div class="foo"></div><div class="foo"></div>';
        var $elems = $('div');
        assert.match($elems[0].className + $elems[1].className, /foofoo/);
        $elems.removeClass('foo');
        assert.lengthOf($elems[0].className + $elems[1].className, 0);
    })

})

describe('toggleClass()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should remove a class from an element if present', function () {
        document.body.innerHTML = '<div class="foo"></div>';
        var $elem = $('div');
        assert.match($elem[0].className, /foo/);
        $elem.toggleClass('foo');
        assert.lengthOf($elem[0].className, 0);
    })

    it('should add a class to an element if not present', function () {
        document.body.innerHTML = '<div></div>';
        var $elem = $('div');
        assert.lengthOf($elem[0].className, 0);
        $elem.toggleClass('foo');
        assert.match($elem[0].className, /foo/);
    })

    it('should only toggle class given', function () {
        document.body.innerHTML = '<div class="foo bar"></div>';
        var $elem = $('div');
        assert.match($elem[0].className, /foo bar/);
        $elem.toggleClass('foo');
        assert.match($elem[0].className, /bar/);
        $elem.toggleClass('foo');
        assert.match($elem[0].className, /bar foo/);
    })

    it('should toggle class on all elements in the set', function () {
        document.body.innerHTML = '<div class="foo"></div><div class="foo"></div>';
        var $elems = $('div');
        assert.match($elems[0].className + $elems[1].className, /foofoo/);
        $elems.toggleClass('foo');
        assert.lengthOf($elems[0].className + $elems[1].className, 0);
    })

})

describe('attr()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should retrieve attribute value with one param', function () {
        document.body.innerHTML = '<div title="foo"></div>';
        var attr = $('div').attr('title');
        assert.match(attr,/foo/);
    })

    it('should set attribute value with two params', function () {
        document.body.innerHTML = '<div></div>';
        var $elem = $('div').attr('title', 'foo');
        assert.match($elem[0].title,/foo/);
    })

    it('should return false if attribute not present', function () {
        document.body.innerHTML = '<div></div>';
        assert.isFalse($('div').attr('title'));
    })

    it('should set attribute on all elements in the set', function () {
        document.body.innerHTML = '<div></div><div></div>';
        var $elems = $('div').attr('title','foo');
        assert.match($elems[0].title + $elems[1].title, /foofoo/);
    })

})

describe('children()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return set of first-level child elements', function () {
        document.body.innerHTML = '<ul><li><span></span></li><li></li><li></li></ul>';
        assert.lengthOf($('ul').children(), 3);
    })

    it('should return children from all elements in the set', function () {
        document.body.innerHTML = '<ul><li></li></ul><p><span></span></p>';
        assert.lengthOf($('ul,p').children(), 2);
    })

})

describe('css()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should retrieve style attribute value with one param', function () {
        document.body.innerHTML = '<div style="position:absolute;"></div>';
        var css = $('div').css('position');
        assert.match(css,/absolute/);
    })

    it('should set style attribute value with two params', function () {
        document.body.innerHTML = '<div></div>';
        var $elem = $('div').css('position', 'absolute');
        assert.match($elem[0].style.position,/absolute/);
    })

    it('should set style attribute on all elements in the set', function () {
        document.body.innerHTML = '<div></div><div></div>';
        var $elems = $('div').css('position','absolute');
        assert.match($elems[0].style.position + $elems[1].style.position, /(absolute){2}/);
    })

})

describe('data()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should retrieve data attribute value with one param', function () {
        document.body.innerHTML = '<div data-attr="value"></div>';
        var data = $('div').data('attr');
        assert.match(data,/value/);
    })

    it('should set data attribute value with two params', function () {
        document.body.innerHTML = '<div></div>';
        var $elem = $('div').data('attr', 'value');
        assert.match($elem[0].getAttribute('data-attr'),/value/);
    })

    it('should set style attribute on all elements in the set', function () {
        document.body.innerHTML = '<div></div><div></div>';
        var $elems = $('div').data('attr','value');
        assert.match($elems[0].getAttribute('data-attr') + $elems[1].getAttribute('data-attr'), /(value){2}/);
    })

})

describe('each()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should iterate through each element in the set', function () {
        document.body.innerHTML = '<div>1</div><div>2</div><div>3</div>';
        var collect = '';
        $('div').each(function(i){
            collect += i + this.innerHTML;
        });
        assert.match(collect, /011223/);
    })

})

describe('filter()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should reduce set of elements by query selector', function () {
        document.body.innerHTML = '<div></div><div class="foo"></div><div></div>';
        var $elem = $('div').filter('.foo');
        assert.lengthOf($elem, 1);
        assert.match($elem[0].className, /foo/);
    })

    it('should reduce set of elements by callback function', function () {
        document.body.innerHTML = '<div></div><div class="foo"></div><div></div>';
        var $elem = $('div').filter(function(){
            if( /foo/.test(this.className) ) {
                return true;
            }
            return false;
        });
        assert.lengthOf($elem, 1);
        assert.match($elem[0].className, /foo/);
    })

})

describe('find()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return set of children filtered by query selector', function () {
        document.body.innerHTML = '<div><span></span><span></span></div>';
        var $elem = $('div').find('span');
        assert.lengthOf($elem, 2);
    })

})

describe('first()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return the first element in the set', function () {
        document.body.innerHTML = '<div>1</div><div>2</div><div>3</div>';
        var $elems = $('div'), $first = $elems.first();
        assert.lengthOf($first, 1);
        assert.equal($elems[0], $first[0]);
    })

})

describe('html()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should retrieve the contents of an element', function () {
        document.body.innerHTML = '<div>foo</div>';
        assert.match($('div').html(), /foo/);
    })

    it('should set the contents of an element', function () {
        document.body.innerHTML = '<div></div>';
        var $elem = $('div').html('foo');
        assert.match($elem[0].innerHTML, /foo/);
    })

    it('should set the contents of all elements in set', function () {
        document.body.innerHTML = '<div></div><div></div>';
        var $elem = $('div').html('foo');
        assert.match($elem[0].innerHTML+$elem[1].innerHTML, /(foo){2}/);
    })

})

describe('index()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return index of element in set', function () {
        var elem = document.createElement('div');
        document.body.appendChild(elem);
        assert.isNumber($('div').index(elem), 0);
    })

    it('should return -1 if element doesn\'t exist', function () {
        var elem = document.createElement('div');
        document.body.innerHTML = '<span></span>';
        assert.isNumber($('span').index(elem), -1);
    })

})

describe('last()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return the last element in the set', function () {
        document.body.innerHTML = '<div>1</div><div>2</div><div>3</div>';
        var $elems = $('div'), $last = $elems.last();
        assert.lengthOf($last, 1);
        assert.equal($elems[2], $last[0]);
    })

})

describe('on()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should attach event to given element', function () {
        $('body').on('click', function(){ return true; })
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, true);
        assert.isTrue(document.body.dispatchEvent(evt));
    })

})

describe('parent()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should return set of first-level parent elements', function () {
        var elem = document.createElement('div');
        elem.innerHTML = '<span>foo</span>';
        document.body.appendChild(elem);
        var $parent = $('span').parent();
        assert.equal(elem, $parent[0]);
        assert.lengthOf($parent, 1);
    })

    it('should not return multiple copies of same parent', function () {
        document.body.innerHTML = '<ul><li></li><li></li><li></li></ul>';
        assert.lengthOf($('li').parent(), 1);
    })

    it('should return parents from all elements in the set', function () {
        var elem1 = document.createElement('div');
        var elem2 = document.createElement('div');
        elem1.innerHTML = '<span>foo</span>';
        elem2.innerHTML = '<span>bar</span>';
        document.body.appendChild(elem1);
        document.body.appendChild(elem2);
        var $parent = $('span').parent();
        assert.equal(elem1, $parent[0]);
        assert.equal(elem2, $parent[1]);
        assert.lengthOf($parent, 2);
    })

    it('should filter parent elements by query selector', function () {
        var elem1 = document.createElement('div');
        elem1.className = 'foo';
        var elem2 = document.createElement('div');
        elem1.innerHTML = '<span>foo</span>';
        elem2.innerHTML = '<span>bar</span>';
        document.body.appendChild(elem1);
        document.body.appendChild(elem2);
        var $parent = $('span').parent('.foo');
        assert.equal(elem1, $parent[0]);
        assert.lengthOf($parent, 1);
    })

})

describe('remove()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should remove an element from the DOM', function () {
        document.body.innerHTML = '<div></div>';
        $('div').remove();
        assert.lengthOf(document.body.innerHTML, 0);
    })

})

describe('siblings()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should collect set of sibling elements', function () {
        document.body.innerHTML = '<h1></h1><div></div><span></span>';
        assert.lengthOf($('h1').siblings(), 2);
    })

    it('should not return multiple copies of same sibling', function () {
        document.body.innerHTML = '<div></div><div></div><span></span>';
        assert.lengthOf($('div').siblings(), 3);
    })

    it('should collect all siblings from every element in the set', function () {
        document.body.innerHTML = '<div><h2></h2><span></span></div><div><h2></h2><span></span></div>';
        assert.lengthOf($('h2').siblings(), 2);
    })

    it('should not return source element in set', function () {
        document.body.innerHTML = '<h1></h1><div></div>';
        assert.lengthOf($('h1').siblings(), 1);
    })

})

describe('wrap()', function() {

    var $
    jsdom()

    before(function () {
        $ = require('../mquery.js');
    })

    it('should wrap an element in another element', function () {
        document.body.innerHTML = '<span></span>';
        var $child = $('span').wrap( 'div' );
        assert.notStrictEqual($child[0].parentNode, '<div><span></span></div>');
    })

    it('should wrap each element in set with another element', function () {
        document.body.innerHTML = '<span></span><span></span>';
        var $children = $('span').wrap( 'div' );
        assert.notStrictEqual($children[0].parentNode, '<div><span></span></div>');
        assert.notStrictEqual($children[1].parentNode, '<div><span></span></div>');
    })

})
