
var React = require('react');
var PutBackStore = require('../stores/PutBackStore');
var mainstore = require('../stores/mainstore');
var Header = require('./Header');
var Navigation = require("./Navigation/Navigation.react");
var Notification = require("./Notification/Notification");
var Bins = require("./Bins/Bins.react");
var Button1 = require("./Button/Button");
var Wrapper = require('./ProductDetails/Wrapper');
var appConstants = require('../constants/appConstants');
var Modal = require('./Modal/Modal');
var SystemIdle = require('./SystemIdle');
var TabularData = require('./TabularData');
var Exception = require('./Exception/Exception');
var ExceptionHeader = require('./ExceptionHeader');
var KQ = require('./ProductDetails/KQ');
var Img = require('./PrdtDetails/ProductImage.js');
var Reconcile = require("./Reconcile");


function getStateData(){
    return mainstore.getScreenData();

}
var PutBack = React.createClass({
  _component:'',
  _notification:'',
  _exception:'',
  _navigation:'',
  getInitialState: function(){
    return getStateData();
  },
  componentWillMount: function(){
    //PutBackStore.addChangeListener(this.onChange);
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){
    //PutBackStore.removeChangeListener(this.onChange);
    mainstore.addChangeListener(this.onChange);
  },
  onChange: function(){ 
    this.setState(getStateData());
  },
  getExceptionComponent:function(){
      var _rightComponent = '';
      this._navigation = '';
      return (
              <div className='grid-container exception'>
                <Modal />
                <Exception data={this.state.PutBackExceptionData} action={true}/>
                <div className="exception-right"></div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION}  color={"black"}/>
                </div>
              </div>
            );
  },
  getScreenComponent : function(screen_id){
    switch(screen_id){
      case appConstants.PUT_BACK_STAGE:
      case appConstants.PUT_BACK_SCAN_TOTE:
         if(this.state.PutBackExceptionStatus == false){
          this._navigation = (<Navigation navData ={this.state.PutBackNavData} serverNavData={this.state.PutBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          this._component = (
              <div className='grid-container'>
                <Modal />
                <div className='main-container'>
                    <Bins binsData={this.state.PutBackBinData} screenId = {this.state.PutBackScreenId} />
                </div>
                <div className = 'staging-action' >
                  <Button1 disabled = {!this.state.StageActive} text = {_("Stage")} module ={appConstants.PUT_BACK} action={appConstants.STAGE_ONE_BIN} color={"orange"}/>
                  <Button1 disabled = {!this.state.StageAllActive} text = {_("Stage All")} module ={appConstants.PUT_BACK} action={appConstants.STAGE_ALL} color={"black"} />  
                </div>
              </div>
            );
          }else{
          this._component = this.getExceptionComponent();
        }

        break;
      case appConstants.PUT_BACK_SCAN:
          if(this.state.PutBackExceptionStatus == false){
          this._navigation = (<Navigation navData ={this.state.PutBackNavData} serverNavData={this.state.PutBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          this._component = (
              <div className='grid-container'>
                <Modal />
                <div className='main-container'>
                    <Bins binsData={this.state.PutBackBinData} screenId = {this.state.PutBackScreenId}/>
                    <Wrapper scanDetails={this.state.PutBackScanDetails} productDetails={this.state.PutBackProductDetails} itemUid={this.state.PutBackItemUid}/>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Scan")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_SCAN} barcode={this.state.PutBackItemUid} color={"black"}/>
                </div>
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }
        break;
      case appConstants.PUT_BACK_TOTE_CLOSE:
          if(this.state.PutBackExceptionStatus == false){
          this._navigation = (<Navigation navData ={this.state.PutBackNavData} serverNavData={this.state.PutBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          var subComponent='';
          var messageType = 'large';
          var m = {
            "details": [],
            "code": "PtB.E.020",
            "description": "Tote Match successfully",
            "level": "info"
          };
          if(this.state.PutBackReconciliation["tableRows"].length > 1 )
            subComponent=(
                <div className='main-container'>
                  <div className="audit-reconcile-left">
                    <TabularData data = {this.state.PutBackReconciliation}/>
                  </div>
                </div>
              );
          else
            subComponent=(
                <Reconcile navMessagesJson={this.props.navMessagesJson} message={m} />
              );
            messageType = "small";
          this._component = (
              <div className='grid-container audit-reconcilation'>
                {subComponent}
                 <div className = 'staging-action' >
                  <Button1 disabled = {false} text = {_("BACK")} module ={appConstants.PUT_BACK} toteId={this.state.PutBackToteId} status={false} action={appConstants.CANCEL_TOTE} color={"black"}/>
                  <Button1 disabled = {false} text = {_("CLOSE")} module ={appConstants.PUT_BACK} toteId={this.state.PutBackToteId} status={true} action={appConstants.CLOSE_TOTE} color={"orange"} />  
                </div>
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }
        break; 
      case appConstants.PUT_BACK_EXCEPTION_DAMAGED_BARCODE:
          this._navigation = '';
          console.log(JSON.stringify(this.state.PutBackKQDetails));
          if(this.state.PutBackExceptionScreen == "damaged")
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <ExceptionHeader data={this.state.PutBackServerNavData} />
                  <KQ scanDetailsGood = {this.state.PutBackKQDetails} />
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {this.state.PutBackKQDetails.current_qty==0} text = {_("NEXT")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.CHANGE_DAMAGED_SCREEN_CONFIRM} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        else if(this.state.PutBackExceptionScreen == "damaged_confirm")
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <div className="main-container exception2">
                    <div className = "kq-exception">
                      <div className="kq-header">{_("Please put unscannable entities in exception area.")}</div>
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {false} text = {_("FINISH")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.SEND_KQ_QTY} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        break; 
       case appConstants.PUT_BACK_EXCEPTION_OVERSIZED_ITEMS:
          this._navigation = '';
          if(this.state.PutBackExceptionScreen == "oversized")
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <ExceptionHeader data={this.state.PutBackServerNavData} />
                  <div className="main-container exception1">
                    <Img srcURL= {this.state.PutBackExceptionProductDetails.image_url}/>
                    <TabularData data = {this.state.PutBackExceptionProductDetails}/>
                    <KQ scanDetails = {this.state.PutBackKQDetails} />
                  </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {this.state.PutBackKQDetails.current_qty==0} text = {_("NEXT")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.CHANGE_OVERSIZED_SCREEN_CONFIRM} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
          else if(this.state.PutBackExceptionScreen == "oversized_confirm")
            this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <div className="main-container exception2">
                    <div className = "kq-exception">
                      <div className="kq-header">{_("Please put oversized entities in exception area.")}</div>
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {false} text = {_("FINISH")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.FINISH_EXCEPTION_ITEM_OVERSIZED} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        break; 
       case appConstants.PUT_BACK_EXCEPTION_EXCESS_ITEMS_IN_BINS:
          this._navigation = '';
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                   <ExceptionHeader data={this.state.PutBackServerNavData} />
                    <div className="main-container exception1">
                      <Bins binsData={this.state.PutBackBinData} screenId = {this.state.PutBackScreenId}/>
                   </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {this.state.PutBackNextButtonState} text = {_("NEXT")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.SEND_EXCESS_ITEMS_BIN}  />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        break; 
      case appConstants.PUT_BACK_EXCEPTION_EXTRA_ITEM_QUANTITY_UPDATE:
          this._navigation = '';
          if(this.state.PutBackExceptionScreen == "extra_quantity")
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <ExceptionHeader data={this.state.PutBackServerNavData} />
                  <KQ scanDetailsGood = {this.state.PutBackKQDetails} />
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {this.state.PutBackKQDetails.current_qty==0} text = {_("NEXT")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.SEND_KQ_QTY_1} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
          else if(this.state.PutBackExceptionScreen == "extra_quantity_update")
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <div className="main-container exception2">
                    <div className = "kq-exception">
                      <div className="kq-header">{_("Please put extra entities in exception area.")}</div>
                    </div>
                  </div>
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {false} text = {_("FINISH")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.CONFIRM_ITEM_PLACE_IN_IRT} />    
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        break; 
      case appConstants.PUT_BACK_EXCEPTION_PUT_EXTRA_ITEM_IN_IRT_BIN:
          this._navigation = '';
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PutBackExceptionData}/>
                <div className="exception-right">
                  <ExceptionHeader data={this.state.PutBackServerNavData} />
                  <div className = "finish-damaged-barcode">
                    <Button1 disabled = {false} text = {_("FINISH")} color={"orange"} module ={appConstants.PUT_BACK} action={appConstants.CONFIRM_ITEM_PLACE_IN_IRT} />  
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PUT_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        break;
      case appConstants.PUT_BACK_INVALID_TOTE_ITEM:
          this._navigation = (<Navigation navData ={this.state.PutBackNavData} serverNavData={this.state.PutBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>)
     
          this._component = (
              <div className='grid-container audit-reconcilation'>
                 <Reconcile navMessagesJson={this.props.navMessagesJson} message={this.state.PutBackToteException} />
                 <div className = 'staging-action' >
                  <Button1 disabled = {false} text = {_("Cancel")} module ={appConstants.PUT_BACK} status={true} action={appConstants.CANCEL_TOTE_EXCEPTION} color={"black"} /> 
                  <Button1 disabled = {false} text = {_("Confirm")} module ={appConstants.PUT_BACK} status={true} action={appConstants.CONFIRM_TOTE_EXCEPTION} color={"orange"} />  
                </div>
              </div>
            );
        break;
      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
          this._navigation = (<Navigation navData ={this.state.PutBackNavData} serverNavData={this.state.PutBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>)
          var _button;
          if(this.state.PutBackScreenId == appConstants.SCANNER_MANAGEMENT){
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
                      <div className="ppsMode"> PPS Mode : {this.state.PutBackPpsMode.toUpperCase()} </div>
                    </div>
                    <div className="col-md-6">
                      <div className="seatType"> Seat Type : {this.state.PutBackSeatType.toUpperCase()}</div>
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

  getNotificationComponent:function(){
    if(this.state.PutBackNotification != undefined)
      this._notification = <Notification notification={this.state.PutBackNotification} navMessagesJson={this.props.navMessagesJson}/>
    else
      this._notification = "";
  },
  render: function(data){ 
    this.getNotificationComponent();
    this.getScreenComponent(this.state.PutBackScreenId);
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

module.exports = PutBack;