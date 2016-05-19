
var vdccontrol = {};
function vdccontrol_init(json_web_token, apiurl, vdc_id) {
  vdccontrol = {
    json_web_token: json_web_token,
    apiurl: apiurl,
    vdc_id: vdc_id
  };
  localStorage.setItem('vdccontrol', JSON.stringify(vdccontrol) );
}

// demo values, we need to feed vdccontrol with config values throw vdccontrol_init()
// var json_web_token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.qQSekbR5BFKQPc3_7gUiDY6Q9y7RojKzvBTLJ9jGtec';
// var apiurl = '/restmachine/cloudapi';
// var vdc_id = 12;
// vdccontrol_init(json_web_token, apiurl, vdc_id);
