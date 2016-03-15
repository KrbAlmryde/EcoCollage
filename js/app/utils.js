// utils.js : Defines reusable patterns

var global = {};

_("queue", d3_queue.queue());

function _( el ) {
    if (el === undefined)
        return global;

    if (global.hasOwnProperty( el )) {

        if (arguments.length > 1 )
            // assign value to element and return it
            return global[ el ] = arguments[1];
        else
            // get it's value
            return global[ el ]

    }
    // otherwise, set the value,
    else {
        // or throw error if one is missing
        if (arguments[1] === null ) console.error("missing arguments to _() function! ")

        return global[ el ] = arguments[1];
    }

}
