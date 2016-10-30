/**
 * mquery ("micro"query)
 * An independent and rudimentary implemenation of jQuery
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 1.0.0
 */

;(function(window){

    // only create mQuery object if jQuery doesn't exist and window does
    if( typeof $ === 'undefined' ) {

        // a local copy of the mQuery object
        $ = function( selector ) {
            return new $.fn.init( selector );
        }

        // create alias and set initial values for the M prototype
        $.fn = $.prototype = {
            constructor: $,
            length: 0,
            mquery: "0.2.0",
            splice: function(){},
            init: function( selector ) {
                // retieve and save all elements to variable
                var elements = ( typeof selector === "string" )
                    ? document.querySelectorAll(selector) : selector;
                // if there are elements, add them this instance
                if( elements !== undefined ) {
                    if( elements.length !== undefined && elements !== window ) {
                        for( var i=0; i<elements.length; i++ ) {
                            this[i] = elements[i];
                            this.length++;
                        }
                    } else {
                        this[0] = elements;
                        this.length++;
                    }
                }
                // return the instance
                return this;
            }
        }

        // Give the init function the jQuery prototype for later instantiation
        $.fn.init.prototype = $.fn;

        // create extend method and add to base
        $.extend = function() {
            // set argument list to local var
            var a = arguments;
            for( var i=0, l=a.length; i<l; i++ ) {
                // add each value to matching key of first object
                for( var k in a[i] ) a[0][k] = a[i][k];
            }
            // return combined object
            return a[0];
        };

        // class methods
        $.extend( $.fn, {
            /**
             * add element(s) to instance
             * @param [object] element(s)
             * @return [object] instance
             */
            add: function( elements ) {
                // create a new instance to collect all elems
                var $combined = $(), length
                // add each existing elem to new inst
                this.each( function(i){
                    $combined[i] = this;
                    $combined.length++;
                });
                // add each element passed in to new inst
                length = $combined.length;
                $(elements).each(function(i){
                    $combined[length+i] = this;
                    $combined.length++;
                });
                // return new combined set of elems
                return $combined;
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
                return $(children);
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
             * returns elements for which the callback returns true
             * @param [string|function] query|callback
             * @return [object] instance
             */
            filter: function( param ) {
                var results = [];
                this.each(function(){
                    var element = this;
                    // if param type is string (css query)
                    if( typeof param == 'string' ) {
                        // grab element's parent's children that match param
                        $(this).parent().find(param).each(function(){
                            // if element matches child, save it
                            if( element == this ) results.push(this);
                        });
                    } else {
                        // if results of callback are true, save it
                        if( param.call(this) ) results.push( this );
                    }
                });
                return $(results);
            },
            /**
             * returns children filtered by a CSS query
             * @param [string] css query
             * @return [object] instance
             */
            find: function( selector ) {
                var results = [];
                this.each(function( index, value ){
                    // results of query
                    var elements = this.querySelectorAll(selector);
                    // make sure there are no duplicates
                    $( elements ).each(function(){
                        // if set doesn't contain this element, add it
                        if( !(results.indexOf(this)+1) ) results.push( this );
                    });
                });
                return $(results);
            },
            /**
             * returns first element in list
             * @return [object] instance
             */
            first: function() {
                return $( this[0] );
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
             * returns first element in list
             * @return [object] instance
             */
            last: function() {
                return $( this[this.length-1] );
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
             * selects a unique set of parent nodes for element set
             * optinally filtered by a selector
             * @return [object] instance
             */
            parent: function( selector ) {
                var results = [];
                this.each(function(){
                    // if no selector, just grab the first parent
                    if( typeof selector == 'undefined' ) {
                        var parent = this.parentNode;
                        if( !(results.indexOf(parent)+1) ) {
                            results.push(parent);
                        }
                    } else {
                        var $elems = $(document.querySelectorAll( selector ));
                        $(this).each(function(){
                            var parent = $(this).parent();
                            // if this parent matches the selector
                            if( $elems.index(parent[0])+1 ) {
                                // if parent isn't already in set, add it
                                if( results.indexOf(parent[0]) == -1 ) {
                                    results.push(parent[0]);
                                }
                            }
                        });
                    }
                });
                return $(results);
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
             * gets the siblings for all elements in set
             * @return [object] instance
             */
            siblings: function() {
                var results = [];
                this.each(function(){
                    var element = this;
                    $(this).parent().children().each(function(){
                        if( element != this && results.indexOf(this) == -1 ) {
                            results.push(this);
                        }
                    });
                });
                return $(results);
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
             * wraps all elements with a given element
             * @param [string] element name
             * @return [object] instance
             */
            wrap: function( elem ) {
                this.each(function(){
                    // create the new elem to wrap this elem with
                    var wrap = document.createElement( elem );
                    // Cache the current parent and sibling
                    var parent = this.parentNode;
                    var sibling = this.nextSibling;
                    // Wrap the element (automatically removed from its current parent)
                    wrap.appendChild(this);
                    // If the element had a sibling, insert the wrapper before
                    // the sibling to maintain the HTML structure; otherwise, just
                    // append it to the parent.
                    if( sibling ){ parent.insertBefore(wrap, sibling); }
                    else { parent.appendChild(wrap); }
                });
                return this;
            }
        });

        // static methods
        $.extend( $, {
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

        // if node, return via module.exports
        if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
            module.exports = $;
        // otherwise, save object to window globally
        } else if( typeof window !== 'undefined' ) {
            window.mQuery = window.$ = $;
        }

    }

})(window);
