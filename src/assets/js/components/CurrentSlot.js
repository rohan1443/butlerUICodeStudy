var React = require('react');
var Header = require('./Header');
var allresourceConstants = require('../constants/resourceConstants');

var CurrentSlot = React.createClass({
	render:function(){		
		var slotStart = this.props.slotDetails[0].split(".")[2] + this.props.slotDetails[0].split(".")[3].slice(1, 2);
		var slotEnd = this.props.slotDetails[1].split(".")[2] + this.props.slotDetails[1].split(".")[3].slice(1, 2);
		var range = slotStart + " - " + slotEnd;		
		
		return (
				<div className="currentSlotWrapper">
					<div className="slotRange">	{range} </div>
					<div className="slotFooter"> {allresourceConstants.CURR_SLOT} </div>
				</div>
						
					
				
			);
	}
});

module.exports = CurrentSlot;