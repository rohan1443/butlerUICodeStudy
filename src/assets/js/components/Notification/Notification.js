var React = require('react');
var ActionCreators = require('../../actions/CommonActions');

var Notification = React.createClass({
    render: function() {
        var navMessagesJson = this.props.navMessagesJson;
        var compData = this.props.notification;
        var message_args  = this.props.notification.details.slice(0);
        var errorCode = this.props.notification.code;
        if(this.props.notification.level!=undefined && this.props.notification.level == "error"){
            var appendClass = 'notify-error';
            var appendClass1 = 'error-icon';
            var appendClass2 = 'glyphicon-remove';
        }else{
            var appendClass = 'notify';
            var appendClass1 = 'success-icon';
            var appendClass2 = 'glyphicon-ok';
        }
        if(errorCode !== null){
        return (

            <div className={appendClass} role="alert">
            	<div className={appendClass1}>
            		<div className="border-glyp">
            			<span className={"glyphicon "+appendClass2}></span>
             		</div>
            	</div>
            	{(function(){
                    if(navMessagesJson != undefined){
                        message_args.unshift(navMessagesJson[errorCode]);
                        if(message_args[0] == undefined){
                            return compData.description;  
                        }else{
                            var notification_message = _.apply(null, message_args);
                            return notification_message;
                        }
                    }
                   
                    }
                )()}
            </div>
        );  
        }else{
            return null;
        }
        

    }
});

module.exports = Notification;