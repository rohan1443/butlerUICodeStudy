var React = require('react');
var TableRow = require('./TableRow');
var TableHeader = require('./TableHeader');

var TabularData = React.createClass({ 
    _tableRows:[],
    getTableRows:function(){
    	var comp =[];
    	this.props.data.tableRows.map(function(value,index){
    		comp.push((<TableRow data={value} />));
    	})
    	this._tableRows = comp;
    },
    render: function() {
    	this.getTableRows();
        var classes = "tabular-data ";
        var size = this.props.size=="double"?classes = classes + "double ":"";
        var size = this.props.size=="triple"?classes = classes + "triple ":"";
        return (
            <div className={classes}>
                <TableHeader data={this.props.data.header}/>
                <div className="overflow" >
                    {this._tableRows}
      		    </div>
            </div>
        );
    },
});

module.exports = TabularData;