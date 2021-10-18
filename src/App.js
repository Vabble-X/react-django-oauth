import React, { Component } from 'react';
import Login from './components/login';
import Home from './components/home';

class App extends Component {
  state = {
    token: localStorage.getItem('token'),
  }
  setAuth = () => {
    this.setState({token: localStorage.getItem('token')});
  }
  LogOut = () => {
    localStorage.removeItem('token');
    this.setState({token: ''});
  }
  render() {
    return (
      <div className="container">
        {this.state.token ? (<Home LogOut={this.LogOut}/>) : (<Login setAuth={this.setAuth}/>)}
      </div>
    );
  }
}

export default App;
