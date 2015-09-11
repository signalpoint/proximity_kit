/**
 * Implements hook_deviceready().
 */
function proximity_kit_deviceready() {
  try {
    
  }
  catch (error) { console.log('proximity_kit - ' + error); }
}

/**
 * Implements hook_menu().
 */
function proximity_kit_menu() {
  try {
    var items = {};
    items['proximity_kit'] = {
      title: 'Proximity Kit',
      page_callback: 'proximity_kit_page',
      pageshow: 'proximity_kit_pageshow'
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}

/**
 *
 */
function proximity_kit_page() {
  try {
    var content = {};
    content['my_intro_text'] = {
      markup: '<div id="beacon-range-log" class="blink"></div><div id="beacon-log" class="blink"></div>'
    };
    return content;
  }
  catch (error) { console.log('proximity_kit_page - ' + error); }
}

/**
 *
 */
function proximity_kit_pageshow() {
  try {
    beaconLogElement = document.getElementById('beacon-log');
    beaconRangeLogElement = document.getElementById('beacon-range-log');
    console.log('watching!');
    watchId = radiusnetworks.plugins.proximitykit.watchProximity(proximityKitSuccessHandler,
    function(message){
        console.log("Failure: Response from plugin is " + message);
    });
  }
  catch (error) { console.log('proximity_kit_pageshow - ' + error); }
}



/**
 * Implements hook_services_postprocess().
 */
function proximity_kit_services_postprocess(options, result) {
  try {
    if (options.service == 'system' && options.resource == 'connect') {
      
    }
  }
  catch (error) { console.log('hook_services_postprocess - ' + error); }
}

var beaconLogElement;
var beaconRangeLogElement;

var logPKEvent = function(pkEvent, displayMessage) {
  logString = new Date().toString() + " ProximityKit event: " + pkEvent[radiusnetworks.plugins.proximitykit.constants.keys.eventType];
  region = pkEvent[radiusnetworks.plugins.proximitykit.constants.keys.region];
  if (region != null)
  {
    logString += " Region: " + JSON.stringify(region);
  }
  beacons = pkEvent[radiusnetworks.plugins.proximitykit.constants.keys.beacons];
  if (beacons != null)
  {
    logString += " Beacons: " + JSON.stringify(beacons);
  }
  console.log(logString);
  
  if (displayMessage)
  {
    beaconLogElement.innerHTML = beaconLogElement.innerHTML + '<p>' + logString + '</p>';
  }
}

var logPKRangeEvent = function(pkEvent) {
  logString = new Date().toString();
  beacon = pkEvent[radiusnetworks.plugins.proximitykit.constants.keys.beacon];
  if (beacon != null)
  {
    logString += " Beacon: " + JSON.stringify(beacon);
  }
  
  console.log(logString);
  beaconRangeLogElement.innerHTML = '<p>' + logString + '</p>';
}

var proximityKitSuccessHandler = function(message) {
  pkEventType = message[radiusnetworks.plugins.proximitykit.constants.keys.eventType];

  switch (pkEventType) {
    case radiusnetworks.plugins.proximitykit.constants.eventTypes.sync:
    case radiusnetworks.plugins.proximitykit.constants.eventTypes.enteredRegion:
    case radiusnetworks.plugins.proximitykit.constants.eventTypes.exitedRegion:
    case radiusnetworks.plugins.proximitykit.constants.eventTypes.determinedRegionState:
      logPKEvent(message, true);
      break;
      
   case radiusnetworks.plugins.proximitykit.constants.eventTypes.rangedBeacon:
      logPKRangeEvent(message, false);
      break;
      
    default:
      console.log("Unexpected ProximityKit event type " + pkEventType);
      break;
  }
};
