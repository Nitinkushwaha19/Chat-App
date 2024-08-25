const User = require("../Model/users.js");
const passport = require("passport");


module.exports.getUser = async(req,res,next) => {
  try {
    let {userId} = req.params;
    const user = await User.findById(userId);

    res.status(200).json(user);

  } catch(err){
    next(err);
  }
}


module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerdUser = await User.register(newUser, password);
    req.login(registerdUser, (err) => {
      console.log("user register successfully!");
      if (err) {
        return next(err);
      }
      return res.json({
        message: "user register successfully!",
        success: true,
      });
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

module.exports.login = (req, res,next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle server errors
    }
    if (!user) {
      return res.status(400).json({ success:false, message: 'Invalid credentials' }); // Handle invalid credentials
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle login errors
      }
      // Send a success response with user info or a token
      return res.json({ success:true, message: 'Login successful', user });
    });
  })(req, res, next);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    return res.json({ message: "Logged Out successfully!", success: true });
  });
};


module.exports.findUser = async (req,res,next) => {
  try{

    const username = req.query.username;
    const user = await User.findOne({username});
    return res.status(200).json(user);

  } catch (err) {
    next(err);
  }
}