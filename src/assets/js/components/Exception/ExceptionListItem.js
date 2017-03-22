var React = require('react');
var CommonActions = require('../../actions/CommonActions');
var mainstore = require('../../stores/mainstore');

function getState(){
  return {
      navMessages : mainstore.getServerMessages()
  }
}

var ExceptionListItem = React.createClass({ 
	_component:[],
  getInitialState: function(){
    return getState();
  },
	setCurrentException:function(data){
     var data1 = {
        "event_name": "",
        "event_data": {}
    };
    data1["event_name"] = "exception";
    data1["event_data"]["event"] = data["event"];
    CommonActions.postDataToInterface(data1);
		CommonActions.setActiveException(data.text);
	},
    render: function() {
      var server_message = this.props.data.text;
      var navMessagesJson = this.state.navMessages;
      var errorCode = this.props.data.exception_id;
      var message_args  = this.props.data.details.slice(0);

        if(this.props.action!=undefined && this.props.action == true){
          return (
              <div className={this.props.data.selected==true?"exception-list-item selected":"exception-list-item"} onClick={this.setCurrentException.bind(this,this.props.data)}>
                   {(function(){
                        if(navMessagesJson != undefined){
                            message_args.unshift(navMessagesJson[errorCode]);
                            if(message_args[0] == undefined){
                              return server_message;  
                            }else{
                            var header_message = _.apply(null, message_args);
                            return header_message;
                            }
                        }
                       
                        }
                    )()}
        		</div>
          );
        }
      else{
        return (
            <div className={this.props.data.selected==true?"exception-list-item selected":"exception-list-item"} >
                 {(function(){
                        if(navMessagesJson != undefined){
                            message_args.unshift(navMessagesJson[errorCode]);
                            if(message_args[0] == undefined){
                              return server_message;  
                            }else{
                            var header_message = _.apply(null, message_args);
                            return header_message;
                            }
                        }
                       
                        }
                    )()}
            </div>
        );
      }
    },
});

module.exports = ExceptionListItem;