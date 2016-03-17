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



function initNutellaComponents() {
    console.log("Connecting Nutella");
    // Parse the query parameters
    var query_parameters = NUTELLA.parseURLParameters();
    console.log(query_parameters);

    // console.log('wallscope: ' + wallscopeId)

    // Get an instance of nutella.
    nutella = NUTELLA.init(
        query_parameters.broker,
        query_parameters.app_id,
        query_parameters.run_id,
        NUTELLA.parseComponentId()
    );

    // (Optional) Set the resourceId
    nutella.setResourceId('ecocollage');

    var isRunning = false;

    subscribeToChannel('ambient-layer', adminMessageCallBack);
    // subscribeToChannel("wallscope_channel", adminMessageCallBack);
}

function subscribeToChannel(channelName, messageHandler) {
    console.log("subscribing to channel:", channelName);
    nutella.net.subscribe(channelName, messageHandler);
}


function publishMessage(channel, message) {
    console.log("publishing a message on channel", channel, message);
    nutella.net.publish(channel, message);
}



function adminMessageCallBack(message, from) {

    console.log('THE MESSAGE', message);

    // 1. Subscribing to a channel
    console.log("Message from", from.component_id, ":", message);
    _("floodGauge").update(+message.data);
}