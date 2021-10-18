import React, { Component } from 'react';

export default class Login extends Component {
  state = {
    login: '',
    password: '',
    error: ''
  }
  handleChangeLogin = (e) => {
    this.setState({login: e.target.value});
  }
  handleChangePassword = (e) => {
    this.setState({password: e.target.value});
  }
  submit = () => {
    const body = {
      login : this.state.login,
      password: this.state.password
    }
    if (this.state.login && this.state.password){
      fetch('/auth?format=json', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
      }).then(res => res.json()).then(json => {
        if (json.error){
          console.log('error');
          this.setState({error: json.error});
        }
        else{
          console.log('Authentication!');
          localStorage.setItem('token', json.token);
          this.props.setAuth();
        }
      });
      this.setState({password: ''});
    }
    else{
      this.setState({error: 'Fill in the missing fields!'});
    }
  }

  render(){
    return(
      <div className="row animated fadeIn">
        <div className="col-lg-6 offset-lg-3 card">
          {this.state.error ? (<p className="text-danger">{this.state.error}</p>) : ''}
          <label>Login:</label>
          <input type="text" className="form-control" value={this.state.login} onChange={this.handleChangeLogin}/>
          <label>Password:</label>
          <input type="password" className="form-control" value={this.state.password} onChange={this.handleChangePassword}/>
          <br />
          <button className="btn btn-light" onClick={this.submit}>Auth</button>
        </div>
      </div>
    );
  }
}
