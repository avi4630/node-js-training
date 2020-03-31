const User = require('./userModel.js');
const jwt=require('jsonwebtoken');
const secretkey="qwerty";
const sendmail=require('./sendmail.js');
const tokenExpiryTime=process.env.TOKENEXPIRYTIME ||'300s';


//login
exports.login = (req, res) => {
    User.find({$and:[{email:req.body.email},{password:req.body.password}]})
    .then(user => {
        if(user.length){
            jwt.sign((req.body),secretkey,{expiresIn:tokenExpiryTime},(err,token)=>{
           if(err)
           res.sendStatus(403);
           else
           res.json({
             "message":"Login Successful",
             "token":token});
            });
        }
        else
        res.sendStatus(403);
    }).catch(err => {
        res.sendStatus(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
  };

//setpassword
exports.setPassword = (req,res) =>{
  User.findOneAndUpdate({email : req.params.email}, {
    password : req.body.password
    }, {new: true})
    .then(user => {
    if(!user) {
        return res.status(404).send({
            message: "User not found with email " + req.params.email
        });
    }
     const info={"to":req.params.email,"msg":"username:"+req.params.email+" and password:"+req.body.password};
      sendmail.sendMail(info);
    res.send(user);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "User not found with email " + req.params.email
        });                
    }
    return res.status(500).send({
        message: "Error updating user with email " + req.params.email
     });
    });

}

// add user
exports.create = (req, res) => {
  if(!req.body.email) {
      return res.status(400).send({
          message: "User email-id can not be empty"
      });
  }

  const user = new User({
      id : req.body.id || "Untitled User", 
      name : req.body.name,
      email : req.body.email
  });

  user.save()
  .then(data => {
      const info={"to":req.body.email,"msg":"Pls setPassword"};
      sendmail.sendMail(info);
      res.send(data);
      
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the User."
      });
  });
};

// get list
exports.getAll = (req, res) => {
  User.find()
  .then(user => {
      res.send(user);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving users."
      });
  });
};

// get user by email
exports.findOne = (req, res) => {
  console.log(req.params.email);
  User.findOne({email :req.params.email})
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "User not found with email " + req.params.email
          });            
      }
      res.send(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with email " + req.params.email
          });                
      }
      return res.status(500).send({
          message: "Error retrieving user with email " + req.params.email
      });
  });
};

// Update user

exports.update = (req,res) =>{
  User.findOneAndUpdate({email : req.params.email}, {
      id : req.body.id,
      name : req.body.name,
      password:req.body.password
    }, {new: true})
    .then(user => {
    if(!user) {
        return res.status(404).send({
            message: "User not found with email " + req.params.email
        });
    }
    res.send(user);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "User not found with email " + req.params.email
        });                
    }
    return res.status(500).send({
        message: "Error updating user with email " + req.params.email
     });
    });

}




// Delete a user by email 
exports.delete = (req, res) => {
  User.findOneAndDelete(req.params.email)
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "User not found with email" + req.params.email
          });
      }
      res.send({message: "User deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "User not found with email " + req.params.email
          });                
      }
      return res.status(500).send({
          message: "Could not delete user with email " + req.params.email
      });
  });
};

