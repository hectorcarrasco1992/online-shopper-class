const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../users/models/User');
require('../../lib/passport');

const userController = require('./controllers/userController');
const userValidation = require('./utils/userValidation');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Register working before controller
// router.post('/register', (req, res, next) => {
//   User.findOne({ email: req.body.email }).then(user => {
//     if (user) return res.send('User Exists');
//     else {
//       const newUser = new User();

//       newUser.profile.name = req.body.name;
//       newUser.email = req.body.email;
//       newUser.password = req.body.password;

//       newUser
//         .save()
//         .then(user => {
//           if (user) {
//             res.status(200).json({ message: 'success', user });
//           }
//         })
//         .catch(err => {
//           return next(err);
//         });
//     }
//   });
// });

// register routes
router.get('/register', (req, res) => {
  res.render('auth/register', { errors: req.flash('errors') });
});
router.post('/register', userValidation, userController.register);

router.get('/login', (req, res) => {
  return res.render('auth/login', { errors: req.flash('errors') });
});

//login routes
router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/api/users/login',
    failureFlash: true
  })
);

//profile routes
router.get('/profile', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.render('auth/profile');
  } else {
    return res.send('Unauthorized');
  }
});

// router.put('/update-profile/:id', (req, res, next) => {
//   return new Promise((resolve, reject) => {
//     User.findById({ _id: req.params.id })
//       .then(user => {
//         if (req.body.name) user.profile.name = req.body.name;
//         if (req.body.email) user.email = req.body.email;
//         if (req.body.address) user.address = req.body.address;
//         return user;
//       })
//       .then(user => {
//         user.save().then(user => {
//           return res.json({ user });
//         });
//       })
//       .catch(err => reject(err));
//   }).catch(err => next(err));
// });
router.put('/update-profile', (req, res, next) => {
  userController
    .updateProfile(req.body, req.user._id)
    .then(user => {
      return res.redirect('/api/users/profile');
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/api/users/update-profile');
    });
});

router.get('/update-profile', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('auth/update-profile');
  }
  return res.redirect('/');
});

router.put('/update-password',(req,res)=>{
  userController.updatePassword(req.body,req.user._id)
  .then((user)=>{
    res.redirect('/api/users/profile')
  }).catch(err =>{
    console.log('hello')
    return res.redirect('/api/users/update-profile')
  })
})
module.exports = router;
