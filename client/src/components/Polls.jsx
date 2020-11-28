import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { getPolls, getUserPolls } from '../store/actions';
import DefaultUserPic from '../uploads/team-male.jpg';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


let appURI = null

if (process.env.NODE_ENV === "production"){
    appURI = process.env.REACT_APP_URL_PRODUCTION
} else {
    appURI = process.env.REACT_APP_URL_DEVELOPMENT
}

class Polls extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentDidMount() {
    const { getPolls } = this.props;
    getPolls();
  }

  // adding the id 
  handleSelect(id) {
    const { history } = this.props;
    history.push(`/poll/${id}`);
   
  }

  render() {
    const { getPolls, getUserPolls, auth } = this.props;
    let heroPic = DefaultUserPic;

       this.props.polls.map(poll =>{
         console.log('image', poll.MVPimage)
        if (poll.MVPimage) {
          heroPic = `${appURI}/${poll.MVPimage}` 
        } else {
          heroPic = DefaultUserPic
        }
    })
       
    const polls = this.props.polls.map(poll => (
      
      <li onClick={() => this.handleSelect(poll._id)} key={poll._id} className="picture-container-polls" >
        <div className="container" >
        <div className="row">
          <div className="col" >
          <img  className="picture-polls float  mr-5 " src={`${appURI}/${poll.Userimage}`} alt="profils pic" />
          <ArrowRightIcon style={{ fontSize: 90, marginRight: '30px', color: 'rgb(65, 60, 60)' }} />
         
          <img  className="picture-polls float right" src={`${appURI}/${poll.MVPimage}`} alt="profils pic" />
         
          </div>
        </div>
        </div>
        <div className="clearfix"></div>
      </li>
    ));

    return (
      <Fragment>
        {auth.isAuthenticated && (
          <div className="buttons_center">
            <button className="button" onClick={getPolls}>
              All polls
            </button>
            <button className="button" onClick={getUserPolls}>
              My polls
            </button>
          </div>
        )}
        <ul className="polls">{polls}</ul>
      </Fragment>
    );
  }
};

export default connect(
  store => ({
    auth: store.auth,
    polls: store.polls,
  }),
  { getPolls, getUserPolls },
)(Polls);
