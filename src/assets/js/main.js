global.jQuery = global.$ = require("jquery");
var React = require('react');
var ReactDOM = require('react-dom');

var LoginForm = require('./components/LoginPage/LoginPage'); 
var Operator = require('./components/Operator');

var App = React.createClass({
  getInitialState: function(){
    return null;
  },
  render: function(){
    return (
      <div className="body-container">
        <LoginForm />
      </div>
    );
  }
});


ReactDOM.render(
    <App />,
    document.getElementById('app')
)
