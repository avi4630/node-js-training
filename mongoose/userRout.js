const express = require('express');
const router = express.Router();
const user = require('./controller');
const verify=require('./verifyToken');


router.post('/login',user.login);

router.put('/user/setpassword/:email',user.setPassword);

router.post('/user',verify.verifyToken,user.create);

 router.get('/users',verify.verifyToken, user.getAll);

 router.get('/user/:email', verify.verifyToken,user.findOne);

 router.put('/user/:email', verify.verifyToken,user.update);

 router.delete('/user/:email',verify.verifyToken, user.delete);

module.exports = router;


