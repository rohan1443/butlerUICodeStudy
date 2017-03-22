var React = require('react');
var fontSize = {
	"font-size":"2rem"};

var SingleSlot = React.createClass({
	render : function(){
		var rackRange = this.props.rackRange;
		var slotId = this.props.index;
		
		return (
			<div className={"singleslot " + (this.props.selected ? 'activeSlot' : '')} style={this.props.type=="small"?fontSize:{}}  >
				{this.props.selected ? rackRange + slotId : ''}
			</div>
			);
	}
});

module.exports = SingleSlot ;