import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';

import Modal from '../containers/UI/Modal/Modal';
import DefaultUserPic from '../uploads/team-male.jpg';
//import { Redirect } from 'react-router-dom';
import AddHero from './AddHero';
import { getPolls, getUserPolls, deletePoll, getHeroes } from '../store/actions';

let appURI = null

if (process.env.NODE_ENV === "production"){
    appURI = process.env.REACT_APP_URL_PRODUCTION
} else {
    appURI = process.env.REACT_APP_URL_DEVELOPMENT
}

const Admin = (props) => {
  
  const [ShowPolar, setShowPolar] = useState(false)
    const [ShowHeroes, setShowHeroes] = useState(false)
   

    useEffect(() =>{
      
      const { getHeroes } = props
     getHeroes()
     console.log('props', props)
    }, [])
  // adding the id 
  const handleSelect = (id) => {
   console.log('props', props)
   //still trying to access individual polls
  }
  const handleDelete = (id) => {
    Axios.delete(`${appURI}/api/poll/${id}`)
        .then(res => {
          console.log(res)
          alert(res.data.message)
        })
  }

  const handleDeleteHero = (id) => {
    Axios.delete(`${appURI}/api/admin/${id}`)
        .then(res => {
          console.log(res)
          alert(res.data.message)
        })
  }

  const showForm = () =>{
   setShowPolar(true)
  }

  const showHero = () =>{
    setShowHeroes(true)
  }

  const dontShow = () => {
    setShowPolar(false)
   setShowHeroes(false)
  }
 

let polls = null

if(props.poll.polls !== undefined){
  polls = props.poll.polls.map(poll => (
    <li onClick={() => handleSelect(poll._id)} key={poll._id}>
       <div className="container" >
      <div className="row">
        <div className="col" >
        <img  className="picture-polls float  mr-5 " src={`${appURI}/${poll.Userimage}`} alt="profils pic" />
        <img  className="picture-polls float right" src={`${appURI}/${poll.MVPimage}`} alt="profils pic" />
        <div>
          <DeleteIcon style={{ color: "red" }} fontSize="small" onClick={() =>handleDelete(poll._id)} key={poll._id} />
        </div>
        
        </div>
        
      </div>
      </div>
      <div className="clearfix"></div>
    </li>
  )) 
 
}

let hero = null

if(props.poll.hero !== undefined){
  hero = props.poll.hero.map(poll => (
    <li onClick={() => handleSelect(poll._id)} key={poll._id}>
       <div className="container" >
      <div className="row">
        <div className="col" >
          <h6>{poll.heroName}</h6>
        <img  className="picture-polls float " src={`${appURI}/${poll.heroImage}`} alt="profils pic" />
        <div>
          <DeleteIcon style={{ color: "red" }} fontSize="small" onClick={() =>handleDeleteHero(poll._id)} key={poll._id} />
        </div>
        
        </div>
        
      </div>
      </div>
      <div className="clearfix"></div>
    </li>
  ));

}

    
    return (
      <div>
        <Modal show={ShowPolar} modalClosed={dontShow} >
          	<div>
              <ul className="polls">{polls}</ul>
            </div>
        </Modal>    
        <Modal show={ShowHeroes} modalClosed={dontShow} >
          	<div>
              <ul className="polls">{hero}</ul>
            </div>
        </Modal>         
        <AddHero/>
        <button className="button" onClick={() => showForm()} >See Polls</button>
        <button className="button" onClick={() => showHero()} >Show Heroes</button>
      </div>
    );
}

export default connect(
  store => ({
    auth: store.auth,
    poll: store.currentPoll
  }),
  { getPolls, getUserPolls, getHeroes, deletePoll })(Admin);
