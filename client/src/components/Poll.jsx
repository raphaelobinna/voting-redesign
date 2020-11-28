import React from 'react';
import {connect} from 'react-redux'
import {ProgressBar, Container} from 'react-bootstrap'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import {vote} from '../store/actions';
import DefaultUserPic from '../uploads/team-male.jpg';

const Poll = ({poll, vote}) => {

    let appURI = null

    if (process.env.NODE_ENV === "production"){
        appURI = process.env.REACT_APP_URL_PRODUCTION
    } else {
        appURI = process.env.REACT_APP_URL_DEVELOPMENT
    }

    let answers = null
    if(poll.poll) {
        answers = ( poll.poll.map(polar => (
            <button 
            onClick={() => vote(poll.user._id, {answer: polar._id })} 
            className="button"
            key={polar._id}> 
                {polar.heroName} 
        </button>
        ))
           
        );
    }


    console.log('poll.voted', poll.voted)
    console.log('poll is', poll)

            //picture display configuration
            let profilePic = null;
           if(poll.user){
             profilePic=`${appURI}/${poll.user.Userimage}` 
           } else{
               profilePic = DefaultUserPic
           }

         
         if (poll.voted){

            let test = poll.user.Votes;
            let totalV = poll.user.TotalVotes
        
            const fish = (test) => {
              if(!test){
                return null;
              }
            
              return test.map((item,key)=>{
        
                const V = item.votes
                const totalVote = totalV
                const now = (V / totalVote * 100).toFixed();
                return (
                    <div key={item._id} className="container mt-3 md-4 xs-6"  >
                        <h4 className="header" > {item.name} </h4>
                        <ProgressBar animated variant="warning" now={now} label={`${now}%`} />
                    </div>
                  
                );
              })
            }
            console.log(fish(test));

             return  <Container mt="5" fluid md="4" xs="6" >
             <div className="row md-4 xs-6" >
                 <div className="col md-4 xs-6 " >
                     <div className="d-flex justify-content-center md-4 xs-6">
                 <img  className="picture float mr-5 fluid " src={profilePic} alt="profils pic" />
                 <div className=" mt-4 mr-5 float center" >
                 <ArrowRightIcon style={{ fontSize: 120 }} />
                 </div>
                 <img  className="picture float right  fluid" src={`${appURI}/${poll.user.MVPimage}` } alt="profils pic" />
                 </div>
                 <div className="clearfix"></div>
                 <div> {fish(test)} </div>
                 </div>
             </div>
         </Container>
         } else {
        return  <div className="container mt-5" >
            <div className="row" >
                <div className="col" >
                    <div className="d-flex justify-content-center">
                <img  className="picture float mr-5" src={profilePic} alt="profils pic" />
                </div>
                <div className="clearfix"></div>
                </div>
            </div>
                <div className="clearfix"></div>
                <div className="buttons_center" >{answers}</div>
        </div>
         }

}

export default connect(store => ({
    poll: store.currentPoll
}), {vote})(Poll);