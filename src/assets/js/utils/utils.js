var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var configConstants = require('../constants/configConstants');
var appConstants = require('../constants/appConstants');
var CommonActions = require('../actions/CommonActions');
var serverMessages = require('../serverMessages/server_messages');
var ws,self;

var utils = objectAssign({}, EventEmitter.prototype, {
    enableKeyboard:function(){
        virtualKeyBoard_login = $('#username, #password').keyboard({
      layout: 'custom',
      customLayout: {
        'default': ['! @ # $ % ^ & * + _', '1 2 3 4 5 6 7 8 9 0 {b}', 'q w e r t y u i o p', 'a s d f g h j k l', '{shift} z x c v b n m . {shift}','{space}', '{a} {c}'],
        'shift':   ['( ) { } [ ] = ~ ` -', '< > | ? / " : ; , \' {b}', 'Q W E R T Y U I O P', 'A S D F G H J K L', '{shift} Z X C V B N M . {shift}','{space}', '{a} {c}']
      },
      css: {
        container: "ui-widget-content ui-widget ui-corner-all ui-helper-clearfix custom-keypad"
      },
      reposition: true,
      alwaysOpen: false,
      initialFocus: true,      
      visible : function(e, keypressed, el){
        el.value = '';
        //$(".authNotify").css("display","none"); 
      },
      
      accepted: function(e, keypressed, el) {
        var usernameValue = document.getElementById('username').value;
        var passwordValue = document.getElementById('password').value;
        if(usernameValue != null && usernameValue !=''  && passwordValue != null && passwordValue != '' ){
          $('#loginBtn').prop('disabled', false);
        }else{
          $('#loginBtn').prop('disabled', true); 
        }    
      }
    }); 
    },
    connectToWebSocket: function(data) { 
        self= this;
        ws = new WebSocket(configConstants.WEBSOCKET_IP);
        if ("WebSocket" in window) {
            ws.onopen = function() {
                $("#username, #password").prop('disabled', false);
                console.log("connected");
                utils.checkSessionStorage();
                clearTimeout(utils.connectToWebSocket)
            };
            ws.onmessage = function(evt) { 
                 if(evt.data == "CLIENTCODE_409" || evt.data == "CLIENTCODE_412"|| evt.data == "CLIENTCODE_401" || evt.data == "CLIENTCODE_400" || evt.data == "CLIENTCODE_503"){
                    var msgCode = evt.data;
                    CommonActions.showErrorMessage(serverMessages[msgCode]);
                    sessionStorage.setItem('sessionData', null);
                    CommonActions.loginSeat(false);
                    utils.enableKeyboard();
                }else{
                var received_msg = evt.data;
                var data = JSON.parse(evt.data);
                if(data.hasOwnProperty('data')){
                    if(data.data == 'disconnect'){
                        utils.sessionLogout();
                        return false;
                    }
                }
                putSeatData(data);
                CommonActions.setCurrentSeat(data.state_data);
                CommonActions.setServerMessages();
            }
            };
            ws.onclose = function() {
                //serverMessages.CLIENTCODE_003;
               /* alert(JSON.stringify(evt));
                if(evt == "CLIENTCODE_409" || evt == "CLIENTCODE_503"){
                    var msgCode = evt;
                    console.log(serverMessages[msgCode]);
                    CommonActions.showErrorMessage(serverMessages[msgCode]);
                    CommonActions.logoutSession(true);
                }*/
                //$("#username, #password").prop('disabled', true);
                //alert("Connection is closed...");
                setTimeout(utils.connectToWebSocket, 100);
            };
        } else {
            alert("WebSocket NOT supported by your Browser!");            
        }
    },
    checkSessionStorage : function(){
        var sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        if(sessionData === null){  
        }else{
            var webSocketData = {
                'data_type': 'auth',
                'data' : {
                    "auth-token" : sessionData.data["auth-token"],
                    "seat_name" : sessionData.data.seat_name
                }
            };
            utils.postDataToWebsockets(webSocketData); 
        }
    },
    postDataToWebsockets: function(data) { 
        console.log(JSON.stringify(data));
        ws.send(JSON.stringify(data));
        setTimeout(CommonActions.operatorSeat, 0, true);
    },
    storeSession : function(data){
        // Put the object into storage
        sessionStorage.setItem('sessionData', JSON.stringify(data));
    },
    getAuthToken : function(data){
        sessionStorage.setItem('sessionData', null);
        var loginData ={
          "username" : data.data.username,
          "password" : data.data.password
        }
        $.ajax({
            type: 'POST',
            url: configConstants.INTERFACE_IP + appConstants.API + appConstants.AUTH + appConstants.TOKEN,
            data: JSON.stringify(loginData),
            dataType: "json",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).done(function(response) {
            var webSocketData = {
                'data_type': 'auth',
                'data' : {
                    "auth-token" : response.auth_token,
                    "seat_name" : data.data.seat_name
                }
            };
            utils.storeSession(webSocketData);
            utils.postDataToWebsockets(webSocketData);
        }).fail(function(data,jqXHR, textStatus, errorThrown) {
            CommonActions.showErrorMessage(data.responseJSON.error);
        });
       
    },
    sessionLogout:function(data){
        sessionStorage.setItem('sessionData', null);
        sessionStorage.setItem('localeData', null);
        location.reload();
        $.ajax({
            type: 'GET',
            url: configConstants.INTERFACE_IP + appConstants.API + appConstants.AUTH + appConstants.LOGOUT,
            dataType: "json",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                "Authentication-Token" : JSON.parse(sessionStorage.getItem('sessionData'))["data"]["auth-token"]
            }
        }).done(function(response) {
            sessionStorage.setItem('sessionData', null);
            location.reload();
        }).fail(function(data,jqXHR, textStatus, errorThrown) {
            alert("Logout Failed");
        });
    },
    postDataToInterface: function(data, seat_name) {
        var retrieved_token = sessionStorage.getItem('sessionData');
        var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"];
        $.ajax({
            type: 'POST',
            url: configConstants.INTERFACE_IP + appConstants.API + appConstants.PPS_SEATS + seat_name + appConstants.SEND_DATA,
            data: JSON.stringify(data),
            dataType: "json",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'Authentication-Token' : authentication_token
            }
        }).done(function(response) {

        }).fail(function(jqXhr) { console.log(jqXhr);
            if(jqXhr.status == 401){
                var msgCode = "CLIENTCODE_401";
                CommonActions.showErrorMessage(serverMessages[msgCode]);
                sessionStorage.setItem('sessionData', null);
                CommonActions.loginSeat(false);
                utils.enableKeyboard();
            }
        });
    },
    generateSessionId: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 50; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        localStorage.setItem("session",text);
    },
    getPeripheralData : function(type, seat_name, status, method){
        var retrieved_token = sessionStorage.getItem('sessionData');
        var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"];
         $.ajax({
            type: 'GET',
            url: configConstants.INTERFACE_IP + appConstants.API + appConstants.PPS_SEATS + seat_name + '/'+ appConstants.PERIPHERALS+'?type='+type,
            dataType: "json",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'Authentication-Token' : authentication_token
            }
        }).done(function(response) {
            CommonActions.updateSeatData(response.data, type, status, method);  
        }).fail(function(jqXhr) {    
           
        });
    },
    updatePeripherals : function(data, method, seat_name){
        var retrieved_token = sessionStorage.getItem('sessionData');
        var authentication_token = JSON.parse(retrieved_token)["data"]["auth-token"];
        var url;
        var method = method;
        if(method == 'POST'){
            url = configConstants.INTERFACE_IP + appConstants.API + appConstants.PPS_SEATS + seat_name + '/'+appConstants.PERIPHERALS+appConstants.ADD;
        }else{
            url = configConstants.INTERFACE_IP + appConstants.API + appConstants.PPS_SEATS + appConstants.PERIPHERALS+'/'+data.peripheral_type+'/'+data.peripheral_id;
        }
         $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'Authentication-Token' : authentication_token
            }
            /*complete:function(xhr,textStatus) {
                if(xhr.status == 409)
                    utils.getPeripheralData(data.peripheral_type, seat_name , '409', method)

            //utils.getPeripheralData(data.peripheral_type, seat_name , 'success', method)
           // CommonActions.updateSeatData(response.data, data.peripheral_type); 
        }*/
        }).done(function(response,statusText,xhr) {
            utils.getPeripheralData(data.peripheral_type, seat_name , 'success', method)
           // CommonActions.updateSeatData(response.data, data.peripheral_type); 
        }).fail(function(jqXhr) {
            if(jqXhr.status == 409)
                    utils.getPeripheralData(data.peripheral_type, seat_name , '409', method)
            else if(jqXhr.status == 400)
                    utils.getPeripheralData(data.peripheral_type, seat_name , '400', method)
            else
                utils.getPeripheralData(data.peripheral_type, seat_name , 'fail', method);
                    
        });
    },
    createLogData: function(message, type) {
        var data = {};
        data["message"] = message;
        data["type"] = type;
        data["session"] = localStorage.getItem("session");
        return data;
    },
    logError: function(data) {
        $.ajax({
            type: 'POST',
            url: "http://192.168.3.93:300/api/log",
            data: data,
            dataType: "json"
        }).success(function(response) {
            console.log("Error logged Successfully");
            console.log("Log Details :");
            console.log(JSON.stringify(data));
        });
    }
});

var putSeatData = function(data) {
    console.log(data);
    switch (data.state_data.mode + "_" + data.state_data.seat_type) {
        case appConstants.PUT_BACK:
            CommonActions.setPutBackData(data.state_data);
            break;
        case appConstants.PUT_FRONT:
            CommonActions.setPutFrontData(data.state_data);
            break;
        case appConstants.PICK_BACK:
            CommonActions.setPickBackData(data.state_data);
            break;
        case appConstants.PICK_FRONT:
            CommonActions.setPickFrontData(data.state_data);
            break;
        case appConstants.AUDIT:
            CommonActions.setAuditData(data.state_data);
            break;
        default:
            return true;
    }
}

module.exports = utils;