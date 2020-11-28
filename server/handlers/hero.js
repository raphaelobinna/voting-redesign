const Polls = require('../models/poll');
const User = require('../models/user');
const Image = require('../models/image');
const Hero = require('../models/hero');



//save hero image
exports.saveHeroImage = async (req, res, next) => {
    try {

        console.log('req.file is ' + req.file.path)

        const { id } = req.decoded;
        
        const user = await User.findById(id)
        console.log(user)

        const image = req.file.path

        const photo = await Image.create({
            image,
            user
        })

        res.status(201).json({...photo._doc, user: user._id}) 
        console.log(...photo.doc)

    } catch (err) {
        err.status = 400;
        console.log(err)
        next(err)
    }
}

exports.createHero = async (req, res, next) => {
    try {
        //getting user from auth middleware
        console.log('req.decoded is', req.decoded)

        //console.log(req.file.path)

        const { id } = req.decoded;
        const user = await User.findById(id)

        //const image = user.image[0]
        // receiving form valuess
        const { heroName, heroImage} = req.body    
        console.log('req.body is '+ req.body)

        const findHero = await Hero.find({ heroName: heroName })
        if(findHero.length > 0) {
            throw new Error('Hero Already Exists');
        } else {
            const hero = await Hero.create({
                user,
                heroName,
                heroImage
            });
            //making sure the new user holds property as the new poll that is been created
            user.hero.push(hero._id);
            await user.save();
    
            res.status(201).json({...hero._doc, user: user._id}) 
        }
        
       
    } catch (err) {
        err.status = 400 
        next(err);
    }
};  

exports.showHero = async (req, res, next) => {
    try {
        const polls = await User.find()
        const hero = await Hero.find()
        console.log('my hero', hero)
        res.status(200).json({hero, polls})
    } catch (err) {
        err.status = 400;
        next(err)
    }
}
exports.updateHero = async (req, res, next) => {
    try {
        let hero = await Hero.findById(req.params.id).lean()
        const { id } = req.decoded

        const user = await User.findById(id)

        const { heroName} = req.body    
        console.log(req.body)
        
        const heroImage = req.body.profileImage

        console.log(heroImage)
    
        if (!hero) {
            throw new Error('Invalid hero');
        }
    
       
          hero = await Hero.findOneAndUpdate({ _id: req.params.id }, (user, heroName, heroImage), {
              new: true,
              runValidators: true,
            })
            res.status(200).json({ hero })       
       
      } catch (err) {
        err.status = 400
        console.log(err)
        next(err);
      }
};

exports.deleteHero = async (req, res, next) => {
    try {
        const { id: heroId } = req.params
        //const { id: userId } = req.decoded

        const hero = await Hero.findById(heroId)

        if(!hero) throw new Error('Hero Not found')

        
        await hero.remove();
        res.status(202).json({ message: 'Hero Successfully deleted' })

    } catch (err) {
        err.status = 500
        console.log(err)
        next(err);
    }
};
