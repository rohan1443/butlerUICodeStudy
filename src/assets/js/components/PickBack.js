
var React = require('react');
var PickBackStore = require('../stores/PickBackStore');
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
var CommonActions = require('../actions/CommonActions');
var Exception = require('./Exception/Exception');
var ExceptionHeader = require('./ExceptionHeader');
var TabularData = require('./TabularData');


function getStateData(){
  /*return {
           PickBackNavData : PickBackStore.getNavData(),
           PickBackNotification : PickBackStore.getNotificationData(),
           PickBackBinData: PickBackStore.getBinData(),
           PickBackScreenId:PickBackStore.getScreenId(),
           PickBackServerNavData : PickBackStore.getServerNavData(),
           PickBackToteDetails : PickBackStore.getToteDetails()

    };*/
    return mainstore.getScreenData();
}

var PickBack = React.createClass({
  _component:'',
  _notification:'',
  _navigation:'',
  _exceptionAction:'',
  getInitialState: function(){
    return getStateData();
  },
  componentWillMount: function(){
    if(this.state.PickBackToteDetails != null){
        this.showModal(this.state.PickBackToteDetails)
    }
    mainstore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function(){ 
    mainstore.removeChangeListener(this.onChange);
  },
  onChange: function(){ 
    this.setState(getStateData());
    if(this.state.PickBackToteDetails != null){
        this.showModal(this.state.PickBackToteDetails)
    }
  },
  getExceptionComponent:function(){
      var _rightComponent = '';
      this._navigation = '';
      return (
              <div className='grid-container exception'>
                <Modal />
                <Exception data={this.state.PickBackExceptionData} action={true}/>
                <div className="exception-right"></div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION}  color={"black"}/>
                </div>
              </div>
            );
  },
  getExceptionAction:function(screen_id){
     switch(screen_id){
        case appConstants.PICK_BACK_EXCEPTION_REPRINT:
          this._exceptionAction = (<Button1 disabled = {false} text = {_("Print")} color={"orange"} module ={appConstants.PICK_BACK} action={appConstants.REPRINT_INVOICE}  />);
          break;
        case appConstants.PICK_BACK_EXCEPTION_SKIP_PRINTING:
          this._exceptionAction = (<Button1 disabled = {this.state.PickBackSelectedBin == null} text = {_("Skip Printing")} color={"orange"} module ={appConstants.PICK_BACK} action={appConstants.SKIP_PRINTING}  />);
          break;
        case appConstants.PICK_BACK_EXCEPTION_DIS_ASSOCIATE_TOTE:
          this._exceptionAction = (<Button1 disabled = {this.state.PickBackSelectedBin == null} text = {_("Dis-associate Tote")} color={"orange"} module ={appConstants.PICK_BACK} action={appConstants.DIS_ASSOCIATE_TOTE}  />);
          break;
        case appConstants.PICK_BACK_EXCEPTION_OVERRIDE_TOTE:
          this._exceptionAction = (<Button1 disabled = {this.state.PickBackSelectedBin == null} text = {_("Override")} color={"orange"} module ={appConstants.PICK_BACK} action={appConstants.OVERRIDE_TOTE}  />);
          break;
        default:
          return true;
      }
  },
  getScreenComponent : function(screen_id){
    switch(screen_id){
      case appConstants.PICK_BACK_BIN:
       if(this.state.PickBackExceptionStatus == false){
        this._navigation = (<Navigation navData ={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          this._component = (
              <div className='grid-container'>
                <Modal />
                <div className='main-container'>
                    <Bins binsData={this.state.PickBackBinData} screenId = {this.state.PickBackScreenId} />
                </div>
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }

        break;
      case appConstants.PICK_BACK_SCAN:
         if(this.state.PickBackExceptionStatus == false){
          this._navigation = (<Navigation navData ={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>);
          this._component = (
              <div className='grid-container'>
                <Modal />
                <div className='main-container'>
                    <Bins binsData={this.state.PickBackBinData} screenId = {this.state.PickBackScreenId} />
                </div>
              </div>
            );
        }else{
          this._component = this.getExceptionComponent();
        }
        break;
       case appConstants.PICK_BACK_EXCEPTION_REPRINT:
       case appConstants.PICK_BACK_EXCEPTION_SKIP_PRINTING:
       case appConstants.PICK_BACK_EXCEPTION_DIS_ASSOCIATE_TOTE:
       case appConstants.PICK_BACK_EXCEPTION_OVERRIDE_TOTE:
          this.getExceptionAction(screen_id);
          this._navigation = '';
          this._component = (
              <div className='grid-container exception'>
                <Exception data={this.state.PickBackExceptionData}/>
                <div className="exception-right">
                   <ExceptionHeader data={this.state.PickBackServerNavData} />
                    <div className="main-container exception1">
                      <Bins binsData={this.state.PickBackBinData} screenId = {this.state.PickBackScreenId}/>
                   </div>
                  <div className = "finish-damaged-barcode">
                    {this._exceptionAction} 
                  </div>
                </div>
                <div className = 'cancel-scan'>
                   <Button1 disabled = {false} text = {_("Cancel Exception")} module ={appConstants.PICK_BACK} action={appConstants.CANCEL_EXCEPTION_TO_SERVER}  color={"black"}/>
                </div>
              </div>
            );
        break; 

      case appConstants.PPTL_MANAGEMENT:
      case appConstants.SCANNER_MANAGEMENT:
          this._navigation = (<Navigation navData ={this.state.PickBackNavData} serverNavData={this.state.PickBackServerNavData} navMessagesJson={this.props.navMessagesJson}/>)
          var _button;
          if(this.state.PickBackScreenId == appConstants.SCANNER_MANAGEMENT){
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
                      <div className="ppsMode"> PPS Mode : {this.state.PickBackPpsMode.toUpperCase()} </div>
                    </div>
                    <div className="col-md-6">
                      <div className="seatType"> Seat Type : {this.state.PickBackSeatType.toUpperCase()}</div>
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
  showModal: function(data) { 

    if(data.tote_status === true && !$('.modal').hasClass('in')){ 
      setTimeout((function(){CommonActions.showModal({
              data:data,
              type:'scan_bin_barcode'
      });
      $('.modal').modal();
      return false;
      }),0)
    }else if(data.tote_status === false && $('.modal').hasClass('in')){ 
      $('.modal').modal('hide');
    }
  },
  getNotificationComponent:function(){
    if(this.state.PickBackNotification != undefined)
      this._notification = <Notification notification={this.state.PickBackNotification} navMessagesJson={this.props.navMessagesJson} />
    else
      this._notification = "";
  },
  render: function(data){
    this.getNotificationComponent();
    this.getScreenComponent(this.state.PickBackScreenId);
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

module.exports = PickBack;