var React = require('react');
var PickFrontStore = require('../stores/PickFrontStore');
var mainstore = require('../stores/mainstore');
var Header = require('./Header');
var KQ = require('./ProductDetails/KQ');
var KQExceptionMissing = require('./ProductDetails/KQExceptionMissing');
var KQExceptionDamaged = require('./ProductDetails/KQExceptionDamaged');
var Navigation = require("./Navigation/Navigation.react");
var Spinner = require("./Spinner/LoaderButler");
var Notification = require("./Notification/Notification");
var Bins = require("./Bins/Bins.react");
var Button1 = require("./Button/Button");
var Wrapper = require('./ProductDetails/Wrapper');
var appConstants = require('../constants/appConstants');
var Rack = require('./Rack/MsuRack.js');
var BoxSerial = require('./BoxSerial.js');
var Modal = require('./Modal/Modal');
var Modal1 = require('./Modal/Modal1');
var CurrentSlot = require('./CurrentSlot');
var PrdtDetails = require('./PrdtDetails/ProductDetails.js');
var CommonActions = require('../actions/CommonActions');
var Exception = require('./Exception/Exception');
var TabularData = require('./TabularData');

var checkListOpen = false;

function getStateData(){
     return mainstore.getScreenData();
};

var PickFront = React.createClass({
  _notification:'',
  _component:'',
  _navigation:'',
  getInitialState: function(){
    return getStateData();
  },
  componentWillMount: function(){   
    if(this.state.PickFrontScreenId === appConstants.PICK_FRONT_MORE_ITEM_SCAN || this.state.PickFrontScreenId === appConstants.PICK_FRONT_PPTL_PRESS){
        this.showModal(this.state.PickFrontChecklistDetails,this.state.PickFrontChecklistIndex);
    }
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){ 
	this.setState(getStateData());
   if(this.state.PickFrontScreenId === appConstants.PICK_FRONT_MORE_ITEM_SCAN || this.state.PickFrontScreenId === appConstants.PICK_FRONT_PPTL_PRESS){
        this.showModal(this.state.PickFrontChecklistDetails,this.state.PickFrontChecklistIndex);
    }else{
     /* $('.modal').modal('hide');
      $('.modal-backdrop').remove();*/
    }
  },
  getNotificationComponent:function(){
    if(this.state.PickFrontNotification != undefined)
      this._notification = <Notification notification={this.state.PickFrontNotification} navMessagesJson={this.props.navMessagesJson} />
    else
      this._notification = "";
  },
  showModal:function(data,index,manual){
    if(manual==true)
      checkListOpen = false;
    var data ={
      'checklist_data' : data,
      "checklist_index" : index,
      "product_details" : this.state.PickFrontProductDetails
    };
    console.log(this.state.PickFrontChecklistOverlayStatus, checkListOpen);
    if(this.state.PickFrontChecklistOverlayStatus === true && checkListOpen == false){
      checkListOpen = true;
      setTimeout((function(){CommonActions.showModal({
              data:data,
              type:'pick_checklist'
      });
      $('.modal').modal();
      //$('.modal').data('bs.modal').escape(); // reset keyboard
      $('.modal').data('bs.modal').options.backdrop = 'static';
      return false;
      }),0)

      

    }
    else if(this.state.PickFrontChecklistOverlayStatus === false && checkListOpen == true) { 
      setTimeout((function (){
          $( ".modal" ).modal('hide');
          //$('.modal-backdrop').remove();
          //$('.modal').on('hidden.bs.modal', function (e) {
            $('.modal').data('bs.modal').escape(); // reset keyboard
            $('.modal').data('bs.modal').options.backdrop = true;
            $('button.close', $('.modal')).show();
          //});
      }), 0)
      checkListOpen = false;
     /* $('.modal').css('display', 'none');
      $('.modal-backdrop').css('display', 'none');*/
     /* $('.modal').on('hidden.bs.modal', function(e)
        { 
            $(this).removeData();
        }) */
    }
    else {
      /*$('.modal').on('hidden.bs.modal', function(e)
        { 
            $(this).removeData();
        }) ;*/
    }

  },
  getExceptionComponent:function(){
      var _rightComponent = '';
      this._navigation = '';
      return (
              <div className='grid-container exception'>
                <Modal />
                <Exception data={this.state.PickFrontExceptionData} action={true}/>
                <div className="exception-right"></div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_EXCEPTION}  color={"black"}/>
                </div>
              </div>
            );
  },
  getScreenComponent : function(screen_id){
    switch(screen_id){
     
      case appConstants.PICK_FRONT_WAITING_FOR_MSU:
       if(this.state.PickFrontExceptionStatus == false){
        this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
        this._component = (
              <div className='grid-container'>
                 <div className='main-container'>
                    <Spinner />
                 </div>
              </div>
            );
      }else{
          this._component = this.getExceptionComponent();
        }
      break;

      case appConstants.PICK_FRONT_LOCATION_SCAN:
         if(this.state.PickFrontExceptionStatus == false){
        this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
        this._component = (
              <div className='grid-container'>
                 <div className='main-container'>
                    <Rack rackData = {this.state.PickFrontRackDetails}/>
                 </div>
              </div>
            );
      }else{
          this._component = this.getExceptionComponent();
        }
      break;

      case appConstants.PICK_FRONT_ITEM_SCAN:
       if(this.state.PickFrontExceptionStatus == false){
         this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
        this._component = (
              <div className='grid-container'>
                 <div className='main-container'>
                    <Rack rackData = {this.state.PickFrontRackDetails}/>
                     <PrdtDetails productInfo={this.state.PickFrontProductDetails} />
                 </div>
              </div>
            );
         }else{
          this._component = this.getExceptionComponent();
        }
      break;


       case appConstants.PICK_FRONT_CONTAINER_SCAN:
        if(this.state.PickFrontExceptionStatus == false){
           this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
        this._component = (
              <div className='grid-container'>
                 <div className='main-container'>
                    <BoxSerial boxData = {this.state.PickFrontBoxDetails} />
                    <Rack rackData = {this.state.PickFrontRackDetails}/>
                 </div>
              </div>
            );
         }else{
          this._component = this.getExceptionComponent();
        }
      break;

      case appConstants.PICK_FRONT_MORE_ITEM_SCAN:
        if(this.state.PickFrontExceptionStatus == false){
         this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
        if(this.state.PickFrontScanDetails.current_qty > 0 && this.state.PickFrontChecklistDetails.length > 0){
          var editButton = ( <Button1 disabled = {false} text = {_("Edit Details")} module ={appConstants.PICK_FRONT} action={appConstants.EDIT_DETAILS} color={"orange"} /> );
        }else{
          var editButton ='';
        }
        this._component = (
              <div className='grid-container'>
                <Modal />          
                <CurrentSlot slotDetails={this.state.PickFrontSlotDetails} />
                <div className='main-container'>
                  <Bins binsData={this.state.PickFrontBinData} screenId = {appConstants.PICK_FRONT_MORE_ITEM_SCAN}/>
                  <Wrapper scanDetails={this.state.PickFrontScanDetails} productDetails={this.state.PickFrontProductDetails} itemUid={this.state.PickFrontItemUid}/>
                </div>
                <div className = 'actions'>
                   <Button1 disabled = {false} text = {_("Cancel Scan")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_SCAN} color={"black"}/>
                   {editButton}
                </div>
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }
      break;

      case appConstants.PICK_FRONT_PPTL_PRESS:
         if(this.state.PickFrontExceptionStatus == false){
          console.log("jindal");
         this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
        if(this.state.PickFrontScanDetails.current_qty > 0 && this.state.PickFrontChecklistDetails.length > 0){
          var editButton = ( <Button1 disabled = {false} text = {_("Edit Details")} module ={appConstants.PICK_FRONT} action={appConstants.EDIT_DETAILS} color={"orange"} /> );
        }else{
          var editButton ='';
        }
        this._component = (
              <div className='grid-container'>
                <Modal />
                <CurrentSlot slotDetails={this.state.PickFrontSlotDetails} />
                <div className='main-container'>
                  <Bins binsData={this.state.PickFrontBinData} screenId = {appConstants.PICK_FRONT_PPTL_PRESS}/>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Scan")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_SCAN} color={"black"}/> 
                    {editButton}
                </div>
              </div>
            );
         }else{
          this._component = this.getExceptionComponent();
        }
      break;
      case appConstants.PICK_FRONT_NO_FREE_BIN:
         if(this.state.PickFrontExceptionStatus == false){
         this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
 
        this._component = (
              <div className='grid-container'>
                <div className='main-container'>
                  <Bins binsData={this.state.PickFrontBinData} screenId = {appConstants.PICK_FRONT_PPTL_PRESS}/>
                </div>
              </div>
            );
         }else{
          this._component = this.getExceptionComponent();
        }
      break;
      case appConstants.PICK_FRONT_EXCEPTION_GOOD_MISSING_DAMAGED:
          this._navigation = '';
          if(this.state.PickFrontExceptionScreen == "good"){
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PickFrontExceptionData}/>
                <div className="exception-right">
                  <div className="main-container">
                    <div className = "kq-exception">
                      <div className="kq-header">{"Good Quantity"}</div>
                      <KQ scanDetailsGood = {this.state.PickFrontGoodQuantity} action={"GOOD"} />
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {false} text = {_("NEXT")} color={"orange"} module ={appConstants.PICK_FRONT} action={appConstants.GET_MISSING_AND_DAMAGED_QTY} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
          }else if(this.state.PickFrontExceptionScreen == "damaged_or_missing"){
             var btnComp;
            console.log("ashish  " + JSON.stringify(this.state.PutFrontDamagedQuantity));
            if(this.state.PickFrontDamagedQuantity.current_qty > 0 ){
               btnComp = ( <Button1 disabled = {false} text = {_("NEXT")} color={"orange"} module ={appConstants.PICK_FRONT} action={appConstants.PLACE_ITEM_BACK} />  );
            }else{
              btnComp = ( <Button1 disabled = {false} text = {_("CONFIRM")} color={"orange"} module ={appConstants.PICK_FRONT} action={appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER} /> );
            }
            this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PickFrontExceptionData}/>
                <div className="exception-right">
                  <div className="main-container">
                    <div className = "kq-exception">
                      <div className="kq-header">{"Missing Quantity"}</div>
                      <KQExceptionMissing scanDetailsMissing = {this.state.PickFrontMissingQuantity} action={"MISSING"} />
                    </div>
                    <div className = "kq-exception">
                      <div className="kq-header">{"Unscannable Quantity"}</div>
                      <KQExceptionDamaged scanDetailsDamaged = {this.state.PickFrontDamagedQuantity} action={"DAMAGED"} />
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode">
                    {btnComp} 
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
          }else if(this.state.PickFrontExceptionScreen == "pick_front_quantity"){
              this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PickFrontExceptionData}/>
                <div className="exception-right">
                  <div className="main-container exception2">
                    <div className = "kq-exception">
                      <div className="kq-header">{_("Please put unscannable entities in exception area.")}</div>
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode"> 
                    <Button1 disabled = {false} text = {_("CONFIRM")} color={"orange"} module ={appConstants.PICK_FRONT} action={appConstants.VALIDATE_AND_SEND_DATA_TO_SERVER} /> 
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
           }
        break;      
        case appConstants.PICK_FRONT_EXCEPTION_MISSING_BOX:
          this._navigation = '';
          if(this.state.PickFrontExceptionScreen == "box_serial"){
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PickFrontExceptionData}/>
                <div className="exception-right">
                  <div className="main-container">
                     <div className = "kq-exception">
                      <div className="kq-header">{"Missing Boxes"}</div>
                      <BoxSerial boxData = {this.state.PickFrontBoxDetails} />
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {false} text = {_("NEXT")} color={"orange"} module ={appConstants.PICK_FRONT} action={appConstants.CONFIRM_FROM_USER} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
          }else if(this.state.PickFrontExceptionScreen == "confirm_from_user"){
              this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PickFrontExceptionData}/>
                <div className="exception-right">
                  <div className="main-container exception2">
                    <div className = "kq-exception">
                      <div className="kq-header">{"Are You sure Given Boxes are not present in Slot ? "}</div>
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode"> 
                    <Button1 disabled = {false} text = {_("CONFIRM")} color={"orange"} module ={appConstants.PICK_FRONT} action={appConstants.SEND_MISSING_BOX_EXCEPTION} /> 
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_FRONT} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
           }
          break;

      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
          this._navigation = (<Navigation navData ={this.state.PickFrontNavData} serverNavData={this.state.PickFrontServerNavData} navMessagesJson={this.props.navMessagesJson}/>)
          var _button;
          if(this.state.PickFrontScreenId == appConstants.SCANNER_MANAGEMENT){
          _button = (<div className = 'staging-action' >                          
                          <Button1 disabled = {false} text = {_("BACK")} module ={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.CANCEL_ADD_SCANNER} color={"black"} />
                          <Button1 disabled = {false} text = {_("Add Scanner")} module ={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.ADD_SCANNER} color={"orange"} />
                      </div>)
          }
          else{
            _button = (<div className = 'staging-action' ><Button1 disabled = {false} text = {_("BACK")} module ={appConstants.PERIPHERAL_MANAGEMENT} status={true} action={appConstants.CANCEL_PPTL} color={"black"} /></div>)
          }
          this._component = (
              <div className='grid-container audit-reconcilation'>
                  <div className="row scannerHeader">
                    <div className="col-md-6">
                      <div className="ppsMode"> PPS Mode : {this.state.PickFrontPpsMode.toUpperCase()} </div>
                    </div>
                    <div className="col-md-6">
                      <div className="seatType"> Seat Type : {this.state.PickFrontSeatType.toUpperCase()}</div>
                    </div>
                  </div>
                  <TabularData data = {this.state.utility}/>
                  {_button}
                  <Modal /> 
              </div>
            );
        break;  


      default:
        return true;
    }
  },
  
  render: function(data){ 
	  this.getNotificationComponent();
    this.getScreenComponent(this.state.PickFrontScreenId);
	
	return (
		<div className="main">
			<Header />
			{this._navigation}
			{this._component}
      {this._notification}
	  </div>   
	  )
  }
});

module.exports = PickFront;