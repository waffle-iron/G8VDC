'use strict';

var vdccontrol = {};
function vdccontrol_init(json_web_token, apiurl, vdc_id, parentelement) {
  vdccontrol = {
    json_web_token: json_web_token,
    apiurl: apiurl,
    vdc_id: vdc_id,
    parentelement: parentelement
  };
}

// demo values, we need to feed vdccontrol with config values throw vdccontrol_init()
// var json_web_token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.qQSekbR5BFKQPc3_7gUiDY6Q9y7RojKzvBTLJ9jGtec';
// var apiurl = '/restmachine/cloudapi';
// var vdc_id = 12;
// var parentelement = $("#vdccontrolparent");
// vdccontrol_init(json_web_token, apiurl, vdc_id, parentelement);
