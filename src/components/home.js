import React, { Component } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DefaultProfilePicture from '../assets/images/profile.png';

export default class Home extends Component {
  state = {
    email: '',
    role: '',
    profilePhoto: this.props.userPhoto ? this.props.userPhoto : DefaultProfilePicture
  }
  componentDidMount() {
    const body = {
      token: localStorage.getItem('token'),
    }
    fetch('/user_data?format=json', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(json => {
      if (json.error) {
        toast.error(json.error)
        this.props.LogOut();
      }
      else {
        this.setState({
          email: json.email,
          role: json.role
        })
      }
    });
  }
  render() {
    return (
      <div>
        <Navbar
          bg="primary"
          variant="dark"
          sticky="top"
          className="d-flex justify-content-between"
        >
          <Nav>
            {
              this.state.role === 0 ? "Admin" : "User"
            }
          </Nav>
          <Nav className="d-flx justify-content-center align-items-center">
            <h5>{this.state.email}</h5>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="bg-transparent border-0">
                <img src={this.state.profilePhoto} width='30' height='30' className="img-thumbnail rounded-circle p-0" alt="" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="mr-5">
                <Dropdown.Item onClick={this.props.LogOut}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
