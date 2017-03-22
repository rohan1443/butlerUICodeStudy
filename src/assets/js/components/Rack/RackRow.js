var React = require('react');
var RackSlot = require('./RackSlot');


var RackRow = React.createClass({
	render: function(){
		
		var rackRange = this.props.rackRange;
		var slotIndexArray = this.props.slotIndexArray;
		var slotData = this.props.slots;
		var totalRackHeight= this.props.totalRackHeight;
		var noOfRows = this.props.noOfRows;	
		var eachRowHeight = this.props.eachRowHeight;
		var eachSlot =[];	
		var type = this.props.type;
        /*var calculateHeight = (eachRowHeight/totalRackHeight)*100;
        var rackRowHeight = {
				
				height : calculateHeight + "%",
			};*/
			var rackRowHeight;
		eachSlot = slotData.map(function(slot,index){
			var x = Math.round((slot[1]/totalRackHeight)*100);
			rackRowHeight = {
				
				flexGrow : x.toString()
			};
			if(slotIndexArray!==undefined  && slotIndexArray.indexOf(index+1) >= 0)
			return(
					<RackSlot totalRackHeight={totalRackHeight} noOfRows={noOfRows} selectedSlot={true} slotHeightData={slot[1]} slotWidthData={slot[0]} slotWidthDataLength={slot[0].length} key={index} slotIndexArrays={slotIndexArray} rackRange={rackRange} type={type} />
					
				);
			else
				return(
					<RackSlot totalRackHeight={totalRackHeight} noOfRows={noOfRows} slotHeightData={slot[1]} slotWidthData={slot[0]} slotWidthDataLength={slot[0].length} slotIndexArrays={slotIndexArray} key={index} rackRange={rackRange} type={type} />
					);
		});
		return (
				<div className="rackRow" style={rackRowHeight} >
					{eachSlot}
				</div>
			);
	}
});

module.exports = RackRow;