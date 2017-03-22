var React = require('react');
var ActionCreators = require('../../actions/CommonActions');
var appConstants = require('../../constants/appConstants');
var AuditStore = require('../../stores/AuditStore');

var IconButton = React.createClass({
    showModal: function(data,type) {
         ActionCreators.showModal({
            data:data,
            type:type
         });
         $('.modal').modal();
        // alert("hiii");
         //e.stopPropagation();
         return false;
     },
    performAction:function(module,action){
        var data = {
                    "event_name": "",
                    "event_data": {}
                };
        switch(module){
            case appConstants.AUDIT:
                switch(action){
                    case appConstants.FINISH_BOX:
                         console.log("gggg");
                         console.log(AuditStore.getCurrentBoxSerialData());
                        data["event_name"] = "audit_actions";
                        data["event_data"]["type"] = "finish_box";
                        ActionCreators.postDataToInterface(data);
                        break;    
                     default:
                        return true; 
                }
            break;
             default:
                return true; 
        }
    },
    render: function() { 
            if(this.props.type == "finish" && this.props.status == true)
                return (
                    <div className="success-icon" onClick={this.performAction.bind(this,this.props.module,this.props.action)}>
                        <div className="border-glyp">
                            <span className="glyphicon glyphicon-ok-circle"></span>
                        </div>
                    </div>
                );
            else if(this.props.type == "finish" && this.props.status == false)
                return (
                    <div className="success-icon disabled" >
                        <div className="border-glyp">
                            <span className="glyphicon glyphicon-ok-circle"></span>
                        </div>
                    </div>
                );
            else if(this.props.type == "edit")
                return (
                <div className="edit-icon" onClick={this.performAction.bind(this,this.props.module,this.props.action)}>
                        <div className="border-glyp">
                            <span className="glyphicon glyphicon-pencil"></span>
                        </div>
                </div>
            );              
    }
});

module.exports = IconButton;