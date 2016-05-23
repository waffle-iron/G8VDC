'use strict';

function getParamValue(paramName){
  var url = window.location.search.substring(1); //get rid of "?" in querystring
  var qArray = url.split('&'); //get key-value pairs
  for (var i = 0; i < qArray.length; i++)
  {
    var pArr = qArray[i].split('='); //split key and value
    if (pArr[0] === paramName){
      return pArr[1]; //return value
    }
  }
}

var vdccontrol = {};
function vdccontrol_init(json_web_token, apiurl, vdc_id) {
  vdccontrol = {
    json_web_token: json_web_token,
    apiurl: apiurl,
    vdc_id: vdc_id
  };
  localStorage.setItem('vdccontrol', JSON.stringify(vdccontrol) );

}

// We need to feed vdccontrol with config values throw vdccontrol_init()
var json_web_token  = getParamValue('jwt');
var apiurl = '/restmachine/cloudapi';
var vdc_id = parseInt(getParamValue('vdc_id'));
vdccontrol_init(json_web_token, apiurl, vdc_id);

// Check /ovccontrol-test.html for Iframe demo!
// P.S. nobody like iframes...
