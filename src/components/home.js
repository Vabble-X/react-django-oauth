import React, { Component } from 'react';

export default class Home extends Component{
    state={
      email: '',
      username: '',
      first_name: '',
      last_name: '',
    }
    componentDidMount(){
      const body = {
        token : localStorage.getItem('token'),
      }
      fetch('/user_data?format=json', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {'Content-Type': 'application/json'}
          }).then(res => res.json()).then(json => {
            if (json.error){
              console.log('Error: ' + json.error);
              this.props.LogOut();
            }
            else{
              console.log('User data is loaded!');
              this.setState({
                email: json.email,
                username: json.username,
                first_name: json.first_name,
                last_name: json.last_name,
              })
            }
          });
    }
    render(){
      return(
        <div className="center animated fadeIn">
          <h3>Logged as {this.state.username}</h3>
          <h4>{this.state.email}</h4>
          <h4>{this.state.first_name} {this.state.last_name}</h4>
          <button onClick={this.props.LogOut} className="btn btn-danger">Log out</button>
        </div>
      );
    }
}
