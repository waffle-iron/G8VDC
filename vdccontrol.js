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
function vdccontrol_init(json_web_token, apiurl, vdc_id, g8_domain, headerEnable) {
  vdccontrol = {
    json_web_token: json_web_token,
    apiurl: apiurl,
    headerEnable: headerEnable,
    vdc_id: vdc_id,
    g8_domain: g8_domain
  };
  if (json_web_token || !localStorage.vdccontrol) {
     localStorage.setItem('vdccontrol', JSON.stringify(vdccontrol));

 }

}

// We need to feed vdccontrol with config values throw vdccontrol_init()
var json_web_token  = getParamValue('jwt');
var headerEnable = !json_web_token;
var apiurl = '/restmachine/cloudapi';
var vdc_id = parseInt(getParamValue('vdc_id'));
var g8_domain = getParamValue('g8_domain');
vdccontrol_init(json_web_token, apiurl, vdc_id, g8_domain, headerEnable);

// Check /ovccontrol-test.html for Iframe demo!
// P.S. nobody like iframes...
