var React = require('react');
var CommonActions = require('../../actions/CommonActions');
var mainstore = require('../../stores/mainstore');
var appConstants = require('../../constants/appConstants');
var resourceConstants = require('../../constants/resourceConstants');
var  _updatedQty = 0, _scanDetails = {},_keypress = false;

var KQ = React.createClass({
    _appendClassDown : '',
    _appendClassUp : '',
    _qtyComponent : null,
    _appendClassDown: '',
    _appendClassUp: '',
    virtualKeyboard: null, 
    _id : 'keyboard',
    _enableIncrement : true,
    _enableDecrement : true,
    changeValueIncrement : function(){
        if( parseInt(_updatedQty) >= parseInt(_scanDetails.total_qty) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0") )
        {
            return false;
        }
        
        _updatedQty++;
        $("#keyboard").val(_updatedQty);
    },
    incrementValue: function(event){
       var self = this;
       var interval;
        if (this._enableIncrement === true) {  
            _keypress = true;
           if( event.type == "mousedown"){
                interval = setInterval(this.changeValueIncrement, 300);           
            }
            else if(event.type == 'click'){
                _updatedQty++;
                console.log(_updatedQty);
            }
            
            $('.topArrow').mouseup(function() {
                clearInterval(interval);
                
            });
            $('.topArrow').mouseout(function(event) {
                clearInterval(interval);              
            });
         
            if(mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE 
                || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() ==appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION
                || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION ){
           
               
            }
            else if(parseInt(_updatedQty) > parseInt(_scanDetails.total_qty) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0" )) {
               _updatedQty = _updatedQty - 1; 
            }
            if(interval == undefined){
               _keypress = false;
            }
            console.log(interval);
            self.handleIncrement();
        }
                                  
    },  
    changeValueDecrement : function(){

        if(_updatedQty <= 0 ){
            _updatedQty = 0;
        }else{
            _updatedQty--;
        }
        if((_updatedQty === 0) && (mainstore.getScreenId() == appConstants.PUT_BACK_SCAN || 
                mainstore.getScreenId() == appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
                mainstore.getScreenId() == appConstants.PUT_FRONT_PLACE_ITEMS_IN_RACK)){
            _updatedQty = 1;
        }
        
        $("#keyboard").val(_updatedQty);
    },
    decrementValue: function(event){
        var self = this;
        var interval;
        if (this._enableDecrement === true) { 
            _keypress = true;
            if( event.type == "mousedown" ){     
                interval = setInterval(this.changeValueDecrement, 300);                
            
            }else if(event.type == 'click') {
               if(_updatedQty <= 0){
                _updatedQty = 0;
                }else{
                _updatedQty--;
                }
    
            }
            $('.downArrow').mouseup(function(){
                clearInterval(interval);
            });

            $('.downArrow').mouseout(function(event) {
                clearInterval(interval);
            });
             if((_updatedQty === 0) && (mainstore.getScreenId() == appConstants.PUT_BACK_SCAN || 
                mainstore.getScreenId() == appConstants.PICK_FRONT_MORE_ITEM_SCAN ||
                mainstore.getScreenId() == appConstants.PUT_FRONT_PLACE_ITEMS_IN_RACK)){
                _updatedQty = 1;
            }

            if(interval == undefined){
                _keypress = false
            }
            self.handleDecrement();
        }
                          
    },                    
    
    handleIncrement: function(event, qty) { console.log(_keypress);
        if (this._enableIncrement === true && _keypress == false) {           
          if((parseInt(_updatedQty) >= parseInt(_scanDetails.total_qty)) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0")){
          }          
                      
            var data = {};
            if(mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION){
                CommonActions.updateKQQuantity(parseInt(_updatedQty));
                return true;
            }
            if(mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED || mainstore.getScreenId() == appConstants.PICK_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED ){
                if(this.props.action != undefined){
                    switch(this.props.action){
                        case "GOOD":
                            CommonActions.updateGoodQuantity(parseInt(_updatedQty));
                        break;
                        case "MISSING":
                            CommonActions.updateMissingQuantity(parseInt(_updatedQty));
                        break;
                        case "DAMAGED":
                            CommonActions.updateDamagedQuantity(parseInt(_updatedQty));
                        break;
                        default:
                    }
                }
                return true;
            }

            if (mainstore.getCurrentSeat() == "audit_front") {

                data = {
                    "event_name": "audit_actions",
                    "event_data": {
                        "type": "change_qty",
                        "quantity": parseInt(_updatedQty)
                    }
                };
            } 
            else if (mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS) {
                data = {
                    "event_name": "put_back_exception",
                    "event_data": {
                        "action": "confirm_quantity_update",
                        "quantity": parseInt(_updatedQty),
                        "event":mainstore.getExceptionType()
                    }
                };
            }  
            else {
                data = {
                    "event_name": "quantity_update_from_gui",
                    "event_data": {
                        "item_uid": this.props.itemUid,
                        "quantity_updated": parseInt(_updatedQty)
                    }
                };
            }
            mainstore.setShowModal(false);
            CommonActions.postDataToInterface(data);
        }
    },
    handleDecrement: function(event) {
        if (this._enableDecrement === true && _keypress == false ) {
            if (parseInt(_updatedQty) >= 0 ) {
                var data = {};
                 if(mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() ==appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION){
                    CommonActions.updateKQQuantity(parseInt(_updatedQty) );
                     return true;
                }
                if(mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED || mainstore.getScreenId() == appConstants.PICK_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED ){
                if(this.props.action != undefined){
                    switch(this.props.action){
                        case "GOOD":
                            CommonActions.updateGoodQuantity(parseInt(_updatedQty) );
                        break;
                        case "MISSING":
                            CommonActions.updateMissingQuantity(parseInt(_updatedQty) );
                        break;
                        case "DAMAGED":
                            CommonActions.updateDamagedQuantity(parseInt(_updatedQty) );
                        break;
                        default:
                    }
                }
                return true;
                }
                if (mainstore.getCurrentSeat() == "audit_front") {
                    data = {
                        "event_name": "audit_actions",
                        "event_data": {
                            "type": "change_qty",
                            "quantity": parseInt(_updatedQty)
                        }
                    };
                }
                else if (mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS) {
                data = {
                    "event_name": "put_back_exception",
                    "event_data": {
                        "action": "confirm_quantity_update",
                        "quantity": parseInt(_updatedQty),
                        "event":mainstore.getExceptionType()
                    }
                };
                }   
                else {
                    data = {
                        "event_name": "quantity_update_from_gui",
                        "event_data": {
                            "item_uid": this.props.itemUid,
                            "quantity_updated": parseInt(_updatedQty)
                        }
                    };
                }
                CommonActions.postDataToInterface(data);
            }
        }
  },
  componentDidMount: function() {
    mainstore.removeChangeListener(this.onChange);
  },
  componentWillMount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  openNumpad : function(id){
    $('#keyboard').removeAttr("disabled");
    var action = this.props.action;
    if (_scanDetails.kq_allowed == true) {
        var qty = _scanDetails.current_qty;
        var itemUid = this.props.itemUid;

          setTimeout(function(){ $('#keyboard').keyboard({
            layout: 'custom',
            customLayout: {
                'default': ['1 2 3', '4 5 6', '7 8 9', '. 0 {b}', '{a} {c}']
            },
            reposition: true,
            alwaysOpen: false,          
            initialFocus: true,
            visible: function(e, keypressed, el) {
                $(".ui-keyboard-button.ui-keyboard-46").prop('disabled', true);
                $(".ui-keyboard-button.ui-keyboard-46").css('opacity', "0.6");
                $(".ui-keyboard").css("width","230px");
                $(".ui-keyboard-preview-wrapper .ui-keyboard-preview").css("font-size","30px");
                $(".ui-keyboard-button").css("width","74px");
                $(".ui-keyboard-accept,.ui-keyboard-cancel").css("width","110px");
                $(".current-quantity").val("");
                $(".ui-widget-content").val("");
            },
            change : function(e, keypressed, el){
                var data ={}
               if(_scanDetails.kq_allowed == false){
                    $('.ui-keyboard-preview').val("");
                    data["code"] = resourceConstants.CLIENTCODE_013;
                    data["level"] = 'error'
                    CommonActions.generateNotification(data);
                }
                else if(parseInt(keypressed.last.val) > 9999){
                    data["code"] = resourceConstants.CLIENTCODE_008;
                    data["level"] = 'error';
                    CommonActions.generateNotification(data);
                    $('.ui-keyboard-preview').val(9999);
               }else if((parseInt(keypressed.last.val) == 0) &&  (mainstore.getScreenId() != appConstants.PICK_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED && mainstore.getScreenId() != appConstants.AUDIT_SCAN && mainstore.getScreenId() != appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE &&  
                    mainstore.getScreenId() != appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE && mainstore.getScreenId() != appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION &&
                     mainstore.getScreenId() != appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE && mainstore.getScreenId() != appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE &&
                      mainstore.getScreenId() != appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION ) ){
                    data["code"] = resourceConstants.CLIENTCODE_009;
                    data["level"] = 'error'
                    CommonActions.generateNotification(data);
                    if(parseInt(keypressed.last.val) <= 9999)
                        $('.ui-keyboard-preview').val(_updatedQty);
                    else
                        $('.ui-keyboard-preview').val(9999);
                }else{
                    data["code"] = null;
                    data["level"] = 'error'
                    CommonActions.generateNotification(data);
                }
            },
            accepted: function(e, keypressed, el) {
                if (e.target.value === '' ) {
                    CommonActions.resetNumpadVal(parseInt(_updatedQty));
                } else  {  
                    var data = {};
                     if( mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE ||  mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION){
                        CommonActions.updateKQQuantity(parseInt(e.target.value));
                         return true;
                    }
                    if(mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED || mainstore.getScreenId() == appConstants.PICK_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED ){
                       if(action != undefined){
                            switch(action){
                                case "GOOD":
                                    CommonActions.updateGoodQuantity(parseInt(e.target.value));
                                break;
                                case "MISSING":
                                    CommonActions.updateMissingQuantity(parseInt(e.target.value));
                                break;
                                case "DAMAGED":
                                    CommonActions.updateDamagedQuantity(parseInt(e.target.value));
                                break;
                                default:
                            }
                        }
                        return true;
                    }
                    if (mainstore.getCurrentSeat() == "audit_front") {
                        data = {
                            "event_name": "audit_actions",
                            "event_data": {
                                "type": "change_qty",
                                "quantity": parseInt(e.target.value)
                            }
                        };
                    }
                    else if (mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS) {
                         data = {
                            "event_name": "put_back_exception",
                            "event_data": {
                                "action": "confirm_quantity_update",
                                "quantity": parseInt(e.target.value),
                                "event":mainstore.getExceptionType()
                            }
                        };
                    }   
                    else {
                        data = {
                            "event_name": "quantity_update_from_gui",
                           "event_data": {
                                "item_uid": itemUid,
                                "quantity_updated": parseInt(e.target.value)
                            }
                        };
                    }
                    CommonActions.postDataToInterface(data);
                }

            }
        }); }, 0)
    }else{
        $('#keyboard').attr("disabled","disabled");
    }
    
  },
  componentWillUnmount: function(){    
    mainstore.removeChangeListener(this.onChange);
    /*
    if(this.virtualKeyboard != null){
      virtualKeyboard.getkeyboard().close();
    }
    */
  },
  onChange: function(){ 
  },
  checkKqAllowed : function(){    
    if(_scanDetails.kq_allowed === true){        
      if((parseInt(_updatedQty) >= parseInt(_scanDetails.total_qty)) && (parseInt(_scanDetails.total_qty) != 0 || _scanDetails.total_qty != "0") ){          
        
          if((mainstore.getScreenId() == appConstants.PUT_FRONT_PLACE_ITEMS_IN_RACK) && (parseInt(_updatedQty) == 1) ){

              this._appendClassDown = 'downArrow disable'; 
              this._enableDecrement = false;
              _scanDetails.kq_allowed = false;
              
          }else{
              this._appendClassDown = 'downArrow enable'; 
              this._enableDecrement = true;
            }
           this._appendClassUp = 'topArrow disable'; 
           this._enableIncrement = false;          
      }
      else{
          this._appendClassUp = 'topArrow enable';
          this._enableIncrement = true;  
          if (mainstore.getCurrentSeat() == "audit_front"){
               if(_updatedQty== 0){
                  this._appendClassDown = 'downArrow disable';
                    this._enableDecrement = false;
                }else{
                  this._appendClassDown = 'downArrow enable';
                  this._enableDecrement = true;
                } 
            }else if(mainstore.getScreenId() == appConstants.PICK_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_BOX_DAMAGED_BARCODE || mainstore.getScreenId() == appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE || mainstore.getScreenId() ==appConstants.AUDIT_EXCEPTION_LOOSE_ITEMS_DAMAGED_EXCEPTION || mainstore.getScreenId() == appConstants.PUT_FRONT_EXCEPTION_SPACE_NOT_AVAILABLE || mainstore.getScreenId() == appConstants.AUDIT_EXCEPTION_ITEM_IN_BOX_EXCEPTION){
                if(_updatedQty == 0){
                  this._appendClassDown = 'downArrow disable';
                  this._enableDecrement = false;
                }else{
                  this._appendClassDown = 'downArrow enable';
                  this._enableDecrement = true;
                }   
            }
            else{
                if(_updatedQty == 1){
                  this._appendClassDown = 'downArrow disable';
                  this._enableDecrement = false;
                }else{
                  this._appendClassDown = 'downArrow enable';
                  this._enableDecrement = true;
                }
            }
      }
    }
    else{
        this._appendClassUp = 'topArrow disable';
        this._appendClassDown = 'downArrow disable';

        this._enableDecrement = false;
        this._enableIncrement = false;      
    }    
  },
 
  handleTotalQty : function(){
 
    if(_scanDetails.total_qty != 0 ){
        this._qtyComponent = (
          <div id='textbox'>
            <input id="keyboard" className="current-quantity" key="text_1" value={_updatedQty} onClick={this.openNumpad.call(null)}/>
            <span className="separator">/</span>
            <span className="total-quantity">{parseInt(_scanDetails.total_qty)}</span> 
          </div>
        );
    }else{
        this._qtyComponent = (
          <div id='textbox'>
            <input id="keyboard"  key="text_1"  value={_updatedQty} onClick={this.openNumpad.call(null)}/> 
          </div>
        );
    }

    },
    render: function(data) {
        if(this.props.scanDetailsMissing == undefined && this.props.scanDetailsDamaged == undefined && this.props.scanDetailsGood == undefined  ){
             this.checkKqAllowed();
            this.handleTotalQty();
            _updatedQty = parseInt(this.props.scanDetails.current_qty);
            _scanDetails = this.props.scanDetails;
           
        }
        else if(this.props.scanDetailsGood != undefined && this.props.scanDetails == undefined){
            _updatedQty = parseInt(this.props.scanDetailsGood.current_qty);
            _scanDetails = this.props.scanDetailsGood;
            this.checkKqAllowed();
            this.handleTotalQty();
        }
        
        
        return ( < div className = "kq-wrapper" >
            < a href = "#" className = {this._appendClassUp} action={this.props.action} onClick={this.incrementValue} onMouseDown = {this.incrementValue} >
            < span className = "glyphicon glyphicon-menu-up" > < /span> < /a> {this._qtyComponent} 
            < a href = "#" className = {this._appendClassDown} action={this.props.action} onClick={this.decrementValue}  onMouseDown = {this.decrementValue} >
            < span className = "glyphicon glyphicon-menu-down" > < /span> < /a> 
            < /div>
        )

    }
});

module.exports = KQ;