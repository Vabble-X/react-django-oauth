import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button';

const { REACT_APP_GOOGLE_CLIENT_ID } = process.env;

export default class Login extends Component {
  state = {
    login: '',
    password: '',
    error: '',
    googleToken: ''
  }
  handleChangeLogin = (e) => {
    this.setState({ login: e.target.value });
  }
  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  onGoogleLoginSuccess = (res) => {
    var userData = res.profileObj;
    var userEmail = userData.email;
    var userPhoto = userData.imageUrl;
    var userToken = res.tokenId;
    this.setState({
      email: userEmail,
      googleToken: userToken
    })

    const body = {
      login: userEmail,
      password: '',
      token: this.state.googleToken
    }
    fetch('/auth?format=json', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(json => {
      if (json.error) {
        toast.error(json.error);
        this.setState({ error: json.error });
      }
      else {
        toast.success('Login Success!')
        localStorage.setItem('token', json.token);
        this.props.setAuth();
      }
    });

    this.props.setImageUrl(userPhoto)
  }

  submit = () => {
    const body = {
      login: this.state.login,
      password: this.state.password,
      token: this.state.googleToken
    }
    if (this.state.login && this.state.password) {
      fetch('/auth?format=json', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json()).then(json => {
        if (json.error) {
          toast.error(json.error);
          this.setState({ error: json.error });
        }
        else {
          toast.success('Login Success!')
          localStorage.setItem('token', json.token);
          this.props.setAuth();
        }
      });
      this.setState({ password: '' });
    }
    else {
      this.setState({ error: 'Fill in the missing fields!' });
    }
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-6 offset-lg-3 card">
            <h5>Sign In</h5>
            <label className="mt-4">Email or Username:</label>
            <input type="text" className="form-control" value={this.state.login} onChange={this.handleChangeLogin} />
            <label className="mt-3">Password:</label>
            <input type="password" className="form-control" value={this.state.password} onChange={this.handleChangePassword} />
            <br />
            <button className="btn btn-primary" onClick={this.submit}>Login</button>
            <br />
            <h6 className="text-center">Or</h6>
            <br />
            <GoogleLogin
              className="form-control"
              render={renderProps => <GoogleButton style={{ width: '100%' }} {...renderProps} />}
              clientId={REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Sign in with Google"
              onSuccess={this.onGoogleLoginSuccess}
              onFailure={({ details }) => { toast.error(details) }}
            />
          </div>
        </div>
      </div>
    );
  }
}
