import React, { Component } from 'react';
import { connect } from 'react-redux';

import DefaultUserPic from '../uploads/team-male.jpg';
import axios from 'axios';
import {Button} from 'react-bootstrap'
import { authUser, logout } from '../store/actions';

let appURI = null

    if (process.env.NODE_ENV === "production"){
        appURI = process.env.REACT_APP_URL_PRODUCTION
    } else {
        appURI = process.env.REACT_APP_URL_DEVELOPMENT
    }


class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      uploadedFile: '',
      profileImage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    const { username, password, profileImage } = this.state;
    const { authType } = this.props;
    e.preventDefault();
    this.props.authUser(authType , { username, password, profileImage });
  }

  UpdateProfileHandler=(e)=>{
    e.preventDefault();

    const formData=new FormData();
formData.append("userImage",this.state.uploadedFile);
//update-profile
axios.post(`${appURI}/api/auth/upload/`, formData ,{
  headers: {
    "content-type": "application/json"
  }
}).then(res=>{
   this.setState({profileImage:res.data.image});
})




}


  render() {
    const { username, password } = this.state;

    if(this.state.profileImage){
        var imagestr=this.state.profileImage;
        var profilePic=`${appURI}/${imagestr}`;
    }else{
         profilePic=DefaultUserPic;
    }
  

    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit}>
          <label className="form-label" htmlFor="username">
            username{' '}
          </label>
          <input
            type="text"
            value={username}
            name="username"
            onChange={this.handleChange}
            autoComplete="off"
            className="form-input"
          />
          <label className="form-label" htmlFor="password">
            password{' '}
          </label>
          <input
            type="password"
            value={password}
            name="password"
            onChange={this.handleChange}
            autoComplete="off"
            className="form-input"
          />
           <div className="picture" > 
        <img  className="picture" src={profilePic} alt="profils pic" />
        </div>
        <div className="clearfix"></div>
         <label className="form-label" htmlFor="userImage">
          Poll Image
        </label>
        <input
          className="form-input"
          type="file"
          name="pollImage"
          onChange={(e) => {
            this.setState({uploadedFile: e.target.files[0]}, () => {
              console.log('state', this.state);
            })
            }}required />
            <Button variant="primary" onClick={this.UpdateProfileHandler}>Update Profile</Button>
        <div className="buttons_center"></div>
            <button className="button" type="submit">
              Submit
            </button>
        </form>
      </div>
    );
  }
}

export default connect(() => ({}), { authUser, logout })(Auth);
