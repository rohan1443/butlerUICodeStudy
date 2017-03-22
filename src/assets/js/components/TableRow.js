var React = require('react');
var IconButton = require('./Button/IconButton');
var appConstants = require('../constants/appConstants');
var CommonActions = require('../actions/CommonActions');
var mainstore = require('../stores/mainstore');

var TableRow = React.createClass({ 
	_component:[],
    peripheralAction : function(action, inc){
        if(action == 'Update' || action == 'Add'){
            CommonActions.convertTextBox(action, inc)     
        }else if(action == 'Finish'){
            var data = {
                "peripheral_id": document.getElementById("peripheralId").value,
                "peripheral_type" : "pptl",
                "barcode" : document.getElementById("barcodePptl").value,
                "pps_bin_id" : inc
            }
            CommonActions.updateData(data, 'POST' , inc)
        }else if(action == 'Delete'){
            if(appConstants.SCANNER_MANAGEMENT == mainstore.getScreenId()){
                var data = {
                    "peripheral_id": inc,
                    "peripheral_type" : "barcode_scanner",
                }
            }else{
                var data = {
                    "peripheral_id": inc,
                    "peripheral_type" : "pptl",
                }
            }
            console.log(data);
            CommonActions.updateData(data, 'DELETE' , inc)
        }
        
    },
    openKeyboard_peripheral: function(id){
        setTimeout(function(){ $('#'+id).keyboard({
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
          }
        });  }, 0);
        
    },
    getComponent:function(){
        var peripheralAction = this.peripheralAction;
        var openKeyboard_peripheral = this.openKeyboard_peripheral;
    	var comp = [];
    	this.props.data.map(function(value,index){
    		var classes = "table-col ";
            var mode = value.mode == 'peripheral' ? classes = classes+ "table-col-peripheral ": "";
            var action = value.actionButton == true ? classes = classes+ "table-col-peripheral-min-width ": "";
            classes = classes+ "table-col-peripheral-"+value.management+" ";
    		var border = value.border == true ? classes = classes + "border-left " : "";
    		var grow = value.grow == true ? classes = classes + "flex-grow ":"";
    		var selected = value.selected == true ? classes = classes + "selected ":"";
    		var large = value.size == "large" ? classes = classes + "large ":classes = classes + "small ";
    		var bold = value.bold == true ? classes = classes + "bold ":"";
    		var disabled = value.disabled == true ? classes = classes + "disabled ":"";
    		var center = value.centerAlign == true ? classes = classes + "center-align ":"";
            var complete = value.status == "complete" ? classes = classes + "complete ":"";
            var missing = value.status == "missing" ? classes = classes + "missing ":"";
            var extra = value.status == "extra" && value.selected == false ? classes = classes + "extra ":"";
            var borderBottom = value.borderBottom == false ? classes = classes + "remove-border ":"";
            //var borderBottom = value.borderBottom == false ? classes = classes + "":"";
            var text_decoration = value.text_decoration == true ? classes = classes + "text_decoration ":"";
            var color = value.color == "blue" ? classes = classes + value.color + " ": "";
            var totalWidth = value.totalWidth == true ? classes = classes + "totalWidth ":"";

            if((value.type != undefined && value.type=="button"))
                comp.push((<div className={classes}><IconButton type={value.buttonType} module={appConstants.AUDIT} action={appConstants.FINISH_BOX} status={value.buttonStatus}/></div>));
            else{
                if(value.actionButton == true){
                  comp.push((<div className={classes} title={value.text} onClick={peripheralAction.bind(null,value.text, value.id)}>{value.text}</div>));
                }
                else if(value.textbox == true){
                  comp.push(<input type='text' id={value.type} className={classes} defaultValue={value.text} onClick={openKeyboard_peripheral.call(null, value.type )} />);
                }else{
    		      comp.push((<div className={classes} title={value.text}>{value.text}</div>));
                }
            }
    	});
    	this._component = comp;
    },
    render: function() {
    	this.getComponent();
        return (
            <div className="table-row">
               {this._component}
      		</div>
        );
    },
});

module.exports = TableRow;