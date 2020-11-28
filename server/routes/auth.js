const router = require('express').Router();
const handle  = require('../handlers');

const multer = require('multer');

const storage = multer.diskStorage({
        destination: function(req, file, cb) {
                cb(null, 'uploads/')
        },
        filename: function(req, file, cb){
                cb(null, Date.now() + file.originalname )
        }
})

const fileFilter = (req, file, cb) => {
        //reject a file
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype ==='image/jpg' ) {
                cb(null, true);
        } else {
                cb(null, false);
        }     
}

const upload = multer({ 
        storage: storage, 
        limits: {
           fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
 })

router.post('/register', handle.register);
router.post('/upload', upload.single('userImage'), handle.saveImage)
router.post('/login', handle.login);
router.put('/user/:id', handle.update)
router.get('/user', handle.show)
router.delete('/user/:id', handle.deleteUser);

module.exports = router;

