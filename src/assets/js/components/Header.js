var React = require('react');
var allSvgConstants = require('../constants/svgConstants');
var CommonActions = require('../actions/CommonActions');
var mainstore = require('../stores/mainstore');
var virtualkeyboard = require('virtual-keyboard');
var jqueryPosition = require('jquery-ui/position');
var virtualKeyBoard_header = null;
var appConstants = require('../constants/appConstants');

function getState(){
     return {
            spinner: mainstore.getSpinnerState(),
            systemIsIdle: mainstore.getSystemIdleState(),
            logoutState: mainstore.getLogoutState(),
            scanAllowed : mainstore.getScanAllowedStatus()
        }
}
var Header = React.createClass({
    virtualKeyBoard: '',
    exceptionMenu:'',
    getInitialState: function() {
        return getState();
    },
    openKeyboard: function() {
        $("#actionMenu").hide();
        $(".form-control").blur();
         virtualKeyBoard_header = $('#barcode').keyboard({
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
            position: {
                of: $('.keyboard-actions'),
                my: 'center top',
                at: 'center top'
            },
            visible : function(e, keypressed, el){
                el.value = '';
            },
            accepted: function(e, keypressed, el) {
                if (e.target.value === '') {
                } else {
                    var data = {
                        "event_name": "process_barcode",
                        "event_data": {
                            "barcode": e.target.value,
                        }
                    }
                    CommonActions.postDataToInterface(data);
                }
            }
        })
        $('#barcode').data('keyboard').reveal();
    },    
    logoutSession:function(){
        $("#actionMenu").hide();        
        if(mainstore.getLogoutState() === "false" || mainstore.getLogoutState() === false){             
            return false;
        }
        else{
            CommonActions.logoutSession(true);
        }        
        
    },
    componentDidMount: function() { 
    },
    enableException:function(){
        CommonActions.enableException(true);
        var data = {};
        data["code"] = null;
        data["level"] = 'error'
        CommonActions.generateNotification(data);
        $("#actionMenu").hide();
    },    
    showMenu: function(){
        $("#actionMenu").toggle();
        $(".subMenu").hide();
    },
    refresh: function(){
           location.reload();
        
    },
    componentWillMount: function() {
        mainstore.addChangeListener(this.onChange);
    },
    onChange: function() {
        if(virtualKeyBoard_header != null){
            virtualKeyBoard_header.getkeyboard().close();
        }
        this.setState(getState());
    },
    getExceptionMenu:function(){
        var x = "";
        for( var prop in appConstants ) {
        if( appConstants.hasOwnProperty( prop ) ) {
             if( appConstants[ prop ] == mainstore.getScreenId() )
                 x = prop;
        }
     }
        if(x.search("EXCEPTION") != -1 )
            this.exceptionMenu = '';
        else if(mainstore.getExceptionAllowed().length > 0 )
            this.exceptionMenu =   (<div className="actionItem" onClick = {this.enableException} >
                                        Exception
                                    </div>);
        else
            this.exceptionMenu = '';
    },    
    peripheralData : function(type){
        CommonActions.getPeriPheralData(type);
        $("#actionMenu").hide();
    },
    utilityMenu : function(){
        $(".subMenu").toggle();       
        //CommonActions.displayperipheralMenu();
    },
    render: function() {    
        var logoutClass;
        var cssClass;  
        var disableScanClass;    
        this.getExceptionMenu();
        if(this.state.spinner || this.state.systemIsIdle){
            cssClass = 'keyboard-actions hide-manual-barcode'
        } else{
            cssClass = 'keyboard-actions'
        }
        if(mainstore.getLogoutState() === "false" || mainstore.getLogoutState() === false){
            logoutClass = 'actionItem disable'
        } else{
            logoutClass = 'actionItem'
        }
        if(this.state.scanAllowed == true){
            disableScanClass = '';
        }else{
            disableScanClass = 'disableScanClass'
        }
        return (<div>
            <div className="head">
              <div className="logo">
              <img src={allSvgConstants.logo} />
              </div>
                <div className={cssClass} onClick={this.openKeyboard}>
                  <img src={allSvgConstants.scanHeader} className={disableScanClass} />
                  <input id="barcode" type="text" value='' />
                </div>
              <div className="header-actions" onClick={this.showMenu} >
                 <img src={allSvgConstants.menu} />
                 
              </div>
            </div>
            <div className="actionMenu" id="actionMenu" >
             
                {this.exceptionMenu}  
                <div className="actionItem" onClick = {this.utilityMenu} >
                    Utility
                    <div className="subMenu" onClick={this.peripheralData.bind(this, 'pptl')}>
                        PPTL Management
                    </div>
                    <div className="subMenu" onClick={this.peripheralData.bind(this, 'barcode_scanner')}>
                        Scanner Management
                    </div>
                </div>  
                <div className={logoutClass} onClick = {this.logoutSession} >
                    Logout
                </div>
            </div>
            </div>
        );
    },
});

module.exports = Header;
