const jwt = require('jsonwebtoken');
const Image = require('../models/image');
const User = require('../models/user');

exports.saveImage = async (req, res, next) => {
    try {

        console.log('req.file is ' + req.file)

        const image = req.file.path
        console.log(image)

        const photo = await Image.create({
            image
        })

        res.status(201).json({...photo._doc}) 
        console.log(...photo.doc)

    } catch (err) {
        err.status = 400;
        next(err)
    }
}

exports.register = async (req, res, next) => {
   
     try {

         const {username, password, profileImage} = req.body
         console.log('req.body is ', req.body)
         const Userimage = profileImage
         console.log('image is ', Userimage)

         const MVPimage = "uploads/team-male.jpg"

         let user = await User.findOne({username: username});
         if (user) {
            throw new Error('Invalid username/password');
         } else {
            user = await User.create({
                username,
                password,
                Userimage,
                MVPimage
            });
            const {id} = user;
   
            //Generate json web token
            const maxAge = 1 * 60 * 60
            const token = jwt.sign({id}, `${process.env.SECRET}`, { expiresIn: maxAge })
            res.status(201).json({
                id, 
                username,
                Userimage,
                token
            });
         }
          
     } catch (err) {
         if (err.code === 11000){
             err.message = 'Sorry, that username is already taken'
         }
         next(err)
     }
};

exports.login =  async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const {id, username} = user;
       
        const valid = await user.comparePassword(req.body.password);

        if(valid){
            //Generate json web token
            const maxAge = 1 * 60 * 60
            const token = jwt.sign({id, username}, `${process.env.SECRET}`, { expiresIn: maxAge })
            res.json({
                id,
                username,
                token
            })
        } else {
            throw new Error('Invalid username/password');
        }
    } catch (err) {
        err.message = 'Invalid username/password'
        next(err)
    }
};

exports.update = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id).lean()
        const { id: userId } = req.decoded
    
        if (!user) {
            throw new Error('Invalid username');
        }
    
        if (user._id === userId) {
          user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
              new: true,
              runValidators: true,
            })
            res.status(200).json({ user })       
        } else {
          res.status(400)
          throw new Error('Could not Update')
          
        }
      } catch (err) {
        err.status = 400
        console.log(err)
        next(err);
      }
};

exports.show = async (req, res, next) => {
    try {
        const user = await User.find()
                                 .populate('username', 'id')


        res.status(200).json(user)
    } catch (err) {
        err.status = 400;
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { id: userId } = req.params
        const { id: userReqId } = req.decoded

        const user = await User.findById(userId)

        if(!user) throw new Error('User not found')

        //authenticating user ID
         if(userId !== userReqId) {
             throw new Error('Unauthorized access')
         }  
        
        await user.remove();
        res.status(202).json({ message: 'User successfully deleted' })
    } catch (err) {
        err.status = 500
        console.log(err)
        next(err);
    }
};