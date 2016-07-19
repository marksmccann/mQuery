/**
 * mQuery ("mark"Query)
 * An independent and rudimentary implemenation of jQuery
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 */

var mQuery = (function(){

    // constructor
    var M = function( elements ) {
        // set the length attribute
        this.length = elements.length;
        // add each element to index
        for( var i=0; i<elements.length; i++ ) {
            this[i] = elements[i];
        }
        // return instance
        return this;
    };

    // namespace to hold utility functions
    M.util = {};

    /**
     * combines attributes of multiple objects into one
     * @param [objects]
     * @return [object]
     */
    M.util.extend = function() {
        // set argument list to local var
        var a = arguments;
        for( var i=0, l=a.length; i<l; i++ ) {
            // add each value to matching key of first object
            for( var k in a[i] ) a[0][k] = a[i][k];
        }
        // return combined object
        return a[0];
    };

    // utlity functions
    M.util.extend( M.util, {
        /**
         * performs asynchronous HTTP request (AJAX)
         * @param [string] url
         * @param [function]
         */
         ajax: function( url, callback ) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    callback.call( this, xhttp.responseText, xhttp );
                }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
        }
    });

    // prototype methods
    M.util.extend( M.prototype, {
        /**
         * add an element(s) to this list
         * @param [object] element(s)
         * @return [object] instance
         */
        add: function( elements ) {
            var length = this.length;
            if( elements.length ) {
                for( var i=0; i<elements.length; i++ ) {
                    this[length+i] = elements[i];
                    this.length++;
                }
            } else {
                this[length] = elements;
                this.length++;
            }
            return this;
        },
        /**
         * remove element(s) from the DOM
         * @param [object] element(s)
         * @return [object] instance
         */
        remove: function() {
            this.each(function(){
                if (this.parentNode) {
                    var e = this;
                    this.parentNode.removeChild( e );
                }
            });
            return this;
        },
        /**
         * iterates through elements and runs callback on each
         * @param [function] callback
         * @return [object] instance
         */
        each: function( callback ) {
            for ( var i=0; i<this.length; i++ ) {
                callback.call( this[i], i, this[i] );
            }
            return this;
        },
        /**
         * adds class to all elements
         * @param [string] class
         * @return [object] instance
         */
        addClass: function( className ) {
            if( className.length > 0 ) {
                this.each( function(){
                    this.classList.add( className );
                });
            }
            return this;
        },
        /**
         * removes class from all elements
         * @param [string] class
         * @return [object] instance
         */
        removeClass: function( className ) {
            this.each( function(){
                this.classList.remove( className );
            });
            return this;
        },
        /**
         * adds/removes class to all elements
         * @param [string] class
         * @return [object] instance
         */
        toggleClass: function( className ) {
            this.each( function(){
                this.classList.toggle( className );
            });
            return this;
        },
        /**
         * determines if class is present on any of the elements
         * @param [string] class
         * @return [boolean]
         */
        hasClass: function( className ) {
            var match = false;
            this.each( function(){
                if( this.classList.contains(className) ) {
                    match = true;
                }
            });
            return match;
        },
        /**
         * collects and returns all children of elements
         * @return [object] instance
         */
        children: function() {
            var children = [];
            this.each( function(){
                $( this.children ).each( function(){
                    children.push( this );
                });
            });
            return $( children );
        },
        /**
         * returns elements for which the callback returns true
         * @param [string|function] query|callback
         * @return [object] instance
         */
        filter: function( param ) {
            var results = $([]);
            this.each(function(){
                var element = this;
                // if param type is string (css query)
                if( typeof param == 'string' ) {
                    // grab element's parent's children that match param
                    $(this).parent().find(param).each(function(){
                        // if element matches child, save it
                        if( element == this ) results.add( this );
                    });
                } else {
                    // if results of callback are true, save it
                    if( param.call(this) ) results.add( this );
                }
            });
            return results;
        },
        /**
         * returns first element in list
         * @return [object] instance
         */
        first: function() {
            return $( this[0] );
        },
        /**
         * returns first element in list
         * @return [object] instance
         */
        last: function() {
            return $( this[this.length-1] );
        },
        /**
         * set attribute for all, or get value for one
         * @param [string] attribute
         * @param [string] value
         * @return [string|object]
         */
        attr: function( attr, value ) {
            // if no value param, just get value
            if( typeof value == 'undefined' ) {
                var a = this[0].getAttribute(attr);
                return a && a.length > 0 ? a : false;
            // if value param, set attribute for all
            } else {
                this.each( function(){
                    this.setAttribute( attr, value );
                });
                return this;
            }
        },
        /**
         * set data attribute for all, or get value for one
         * @param [string] attribute
         * @param [string] value
         * @return [string|object]
         */
        data: function( attr, value ) {
            // if no value, just get value
            if( typeof value == 'undefined' ) {
                return this.attr( 'data-'+ attr );
            // if value, set attribute for all
            } else {
                return this.attr( 'data-'+ attr, value );
            }
        },
        /**
         * bind event listener to element(s)
         * @param [string] event
         * @param [function] callback
         * @return [object] instance
         */
        on: function( event, callback ) {
            this.each( function( index, element ){
                this.addEventListener( event, function(event){
                    callback.call( element, event, index, element );
                }, false );
            });
            return this;
        },
        /**
         * wraps all elements with a given element
         * @param [object] wrapper
         * @return [object] instance
         */
        wrap: function( wrapper ) {
            this.each(function(){
                // Cache the current parent and sibling
                var parent = this.parentNode;
                var sibling = this.nextSibling;
                // Wrap the element (automatically removed from its current parent)
                wrapper.appendChild(this);
                // If the element had a sibling, insert the wrapper before
                // the sibling to maintain the HTML structure; otherwise, just
                // append it to the parent.
                if( sibling ){ parent.insertBefore(wrapper, sibling); }
                else { parent.appendChild(wrapper); }
            });
            return this;
        },
        /**
         * adds/retrieves inline styles to/from element(s) respectively
         * @param [string] property
         * @param [string] value
         * @return [string|object]
         */
        css: function( property, value ) {
            // if no value param, just get value
            if( typeof value === 'undefined' ) {
                return this[0].style[property];
            // if value param, set attribute for all
            } else {
                this.each( function(){
                    this.style[property] = value;
                });
                return this;
            }
        },
        /**
         * see if DOM element exists in element set
         * @param [DOM]
         * @return [integer] position of element found
         */
        index: function( element ) {
            var pos = -1;
            this.each(function( i ){
                if( this == element ) pos = i;
            });
            return pos;
        },
        /**
         * selects a unique set of parent nodes for element set
         * optinally filtered by a selector
         * @return [object] instance
         */
        parent: function( selector ) {
            var results = $([]);
            this.each(function(){
                // if no selector, just grab the first parent
                if( typeof selector == 'undefined' ) {
                    var parent = this.parentNode;
                    if( !results.index(parent)+1 ) {
                        results.add(parent);
                    }
                } else {
                    var elements = $(document.querySelectorAll( selector ));
                    $(this).each(function(){
                        var parent = $(this).parent();
                        // if this parent matches the selector
                        if( elements.index(parent[0])+1 ) {
                            // if parent isn't already in set, add it
                            if( results.index(parent[0]) == -1 ) {
                                results.add(parent[0]);
                            }
                        }
                    });
                }
            });
            return results;
        },
        /**
         * gets the siblings for all elements in set
         * @return [object] instance
         */
        siblings: function() {
            var results = $([]);
            this.each(function(){
                var element = this;
                $(this).parent().children().each(function(){
                    if( element != this && results.index(this) == -1 ) {
                        results.add(this);
                    }
                });
            });
            return results;
        },
        /**
         * returns children filtered by a CSS query
         * @param [string] css query
         * @return [object] instance
         */
        find: function( selector ) {
            // empty boost object to collect matches
            var results = $([]);
            this.each(function( index, value ){
                // results of query
                var elements = this.querySelectorAll(selector);
                // make sure there are no duplicates
                $( elements ).each(function(){
                    // if set doesn't contain this element, add it
                    if( !results.index(this)+1 ) results.add( this );
                });

            });
            return results;
        },
        /**
         * Get the HTML contents of the first element in
         * the set of matched elements or set the HTML
         * contents of every matched element.
         * @param [string] html
         * @return [object] instance
         */
        html: function( contents ) {
            if( typeof contents == 'undefined' ) {
                return this[0].innerHTML;
            } else {
                this.each(function(){
                    this.innerHTML = contents;
                });
            }
            return this;
        }
    });

    // static methods
    M.util.extend( M, {
        /**
         * initializes boost object
         * @param [string|nodeList|object]
         * @return [object] instance
         */
        init: function( elements ){
            // if a query string, use query selector to retrieve elements
            if( typeof elements == "string" ) {
                elements = document.querySelectorAll(elements);
            }
            // if no length, wrap in array, then init
            return new M( typeof elements.length == 'undefined' ? [elements] : elements );
        }
    });

    // add utility methods to init method
    M.util.extend( M.init, M.util );

    // local and shortcut to init method
    var $ = M.init;

    // if jQuery doesn't already exist, create global shortcut to init method
    if(typeof jQuery == 'undefined') window.$ = M.init;

    // externalize object
    return M;

})();
