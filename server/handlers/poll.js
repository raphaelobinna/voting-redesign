const Polls = require('../models/poll');
const User = require('../models/user');
//const Image = require('../models/image');
const Hero = require('../models/hero');
const Judge = require('../models/judge');
const mongoose = require('mongoose');



// show all the polls
exports.showPolls = async (req, res, next) => {
    try {
        const polls = await User.find()
        res.status(200).json(polls)
    } catch (err) {
        err.status = 400;
        next(err)
    }
};

// show user polls
exports.usersPolls = async (req, res, next) => {
    try {
       // const { id } = req.decoded;
       const {id} = req.decoded
       console.log(id)
        const user = await User.findById(id)
        if (!user.judges) throw new Error('No one has voted for you yet!')
        res.status(200).json(user)

    } catch (err) {
        err.status = 400;
        next(err)
    }
};

// get single user poll
exports.getPoll = async (req, res, next) => {
    try {
        const { id } = req.params

        const { id: voter } = req.decoded
        console.log('req.decoded', req.decoded)

        const ObjectId = mongoose.Types.ObjectId;

        const uservote = await User.find({polls: ObjectId(voter)})
       
        console.log('mia puta', uservote)

       
            if( uservote.length > 0 ) {
                const user = await User.findById(id)
                //const judge = await Judge.find({ pollOwner: id })
                res.status(200).json({voted: true, user})
            }else {
                const user = await User.findById(id)
                const poll = await Hero.find();
        
                if(!poll) throw new Error('No poll found')
        
                res.status(200).json({ voted: false, poll, user});
            }

    } catch (err) {
        err.status = 400
        console.log(err)
        next(err)
    }
};

// vote
exports.vote = async (req, res, next) => {
    try {
        const { id: ownerId } = req.params
        const { id: userId } = req.decoded

        const { answer } = req.body

        const user = await User.findById(ownerId)
        console.log('owner id', user)


        const heroes = await Hero.findById(answer)
        console.log('answer', heroes)
        const hero = heroes.heroName
        console.log('answer', hero)

        const voted = userId
        console.log('voter', voted)
// voting process
const poll = await Polls.create({
    user,
    hero,
    voted
});

user.polls.push(voted);
await user.save();

res.status(201).json({...poll._doc, user: user._id}) 
// checking if its the authenticated user that voted and also eligibility to vote

            // if (poll.voted.filter(user =>
            //     user.toString() === userId
            //     ).length <= 0) {
            //         poll.voted = userId; //pushing voted userId
            //         poll.votedHeroes.push(answer) //pushing voted hero Id
            //         poll.options = vote;
            //         await poll.save();
            //     res.status(202).json(poll)
            //     } else {
            //         throw new Error('Already voted')
            //     }
        
    } catch (err) {
        err.status = 400
        console.log(err)
        next(err);
    }
};

exports.userVotes = async (req, res, next) => {
    try {
        const { id }  = req.params
        console.log('id is', id)

        
        const ObjectId = mongoose.Types.ObjectId;

        const total = await Polls.find({ user: ObjectId(id) })

        console.log('mt total is', total.length)

                            
         const See = await Polls.aggregate([
            {
                $match: {
                    user: ObjectId(id)
                }
            },
            {
                $group:  { _id: "$hero", votedHowmanyTimes: { $push: "$voted"}} 
                   
            },
        ])
        console.log('this is ', See)

         //for a particualar user
        //UserId, the most voted hero, the most voted heroes Image, how many votes per hero,
        if (See) {
            const pollArray = See
            let fish = 0;
            var MVP;
            for (const element of pollArray) {
               if (element.votedHowmanyTimes.length > fish){
                fish = element.votedHowmanyTimes.length
                MVP = element._id
               }
                
            }
        }
        const pollOwner = id
        
        const image = await Hero.find({heroName: MVP})
        let MVPimage = null
         image.map(B => (
            MVPimage = B.heroImage
         ))
        //const MVPimage = image.heroImage
        const TotalVotes = total.length

        console.log('MVP', MVP)
        console.log('pollOwner', pollOwner)
        console.log('MVPimage', MVPimage)

        let Checker = await Judge.find({ pollOwner: id }).lean()
        console.log(Checker)
        if (Checker.length > 0) {
            Checker = await Judge.findOneAndUpdate({pollOwner: id}, ({
                pollOwner,
                MVP,
                MVPimage,
                TotalVotes,
                Votes: See.map(v => (
                    { name: v._id, votes: v.votedHowmanyTimes.length }
                ))
            }), {
                new: true,
                runValidators: true,
            })
            console.log('second', Checker)
        } else {
            Checker = await Judge.create({
                pollOwner,
                MVP,
                MVPimage,
                TotalVotes,
                Votes: See.map(v => (
                    { name: v._id, votes: v.votedHowmanyTimes.length }
                ))
            })
           
        }

        const user = await User.findOneAndUpdate({_id: id}, 
            ({ 
                MVPimage: MVPimage,
                TotalVotes: TotalVotes,
                Votes:  See.map(v => (
                    { name: v._id, votes: v.votedHowmanyTimes.length }
                ))
            }), 
            {
            new: true,
            runValidators: true,
        })
        await user.save()
        console.log('first', Checker)
           console.log('third', Checker)
        res.status(200).json({ voted: true, ...Checker._doc, user})
    } catch (err) {
        err.status = 400
        next(err);
    }
}

exports.deletePoll = async (req, res, next) => {
    try {
        const { id: userId } = req.params
        console.log(userId)
        const user = await User.findById(userId)

        if(!user) throw new Error('User not found')

        //authenticating user ID
       
        await user.remove();
        res.status(202).json({ message: 'User successfully deleted' })
    } catch (err) {
        err.status = 500
        console.log(err)
        next(err);
    }
}