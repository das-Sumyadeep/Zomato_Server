const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const UserModel = require('../../database/user/user');

//validation
const { ValidationSignUp, ValidationSignIn } = require('../../Validation/auth');

const Router = express.Router();


Router.post("/signup", async (req, res) => {
    try {
        const formData = req.body;
        
        // const ValidData = await ValidationSignUp(req.body);

        // calling static function using the model
        await UserModel.checkEmail(formData);

        // storing data to the database
        const UserData = await UserModel.create(formData);

        if (UserData) {
            return res.status(200).json({
                message: "Successfully Created",
            });
        } else {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

    } catch (error) {

        return res.status(500).json({ error: error.message });
    }
});


Router.post("/signin", async (req, res) => {
    try {

        const ValidData = await ValidationSignIn(req.body);
        const { email, password } = ValidData;

        const UserExist = await UserModel.findOne({ email });
        if (!UserExist) {
            return res.json({ message: "Invalid Credentials" });
        }

        const checkPassword = await bcrypt.compare(password, UserExist.password);

        if (checkPassword) {
            const token = await UserExist.generateJwt();
            // console.log(token);
            return res.status(200).json({
                message: "User Authenticated",
                user: UserExist,
                token: token
            });
        }
        return res.json({ message: "Invalid Credentials" });

    } catch (error) {

        return res.status(500).json({ error: error.message });
    }
});


Router.get("/login/success", passport.authenticate("jwt", { session: false }), (req, res) => {
    try{
        
        if(req.user){
        
            return res.status(200).json({
                message: "User Authenticated",
                user: req.user
            });
        }
    }catch (error){
        return res.status(500).json({ error: error.message });
    }    
});

Router.get('/logout', (req, res) => {
    
    // req.logOut();
    // res.clearCookie('jwt');
    res.redirect('https://only-zomato-master.netlify.app');
    
});

Router.get("/google", passport.authenticate('google', {
    scope: ['email', 'profile']
}));


Router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'https://only-zomato-master.netlify.app' }),
    (req, res) => {

        try {
            if (req.user && req.user.token) {
                
                res.cookie('jwt', req.user.token, { httpOnly: false, maxAge: 24 * 60 * 60, secure: false });
                res.redirect('https://only-zomato-master.netlify.app');

            }
        } catch (err) {
            return res.status(500).json({ error: "Internal server Error" });
        }

    }
);

module.exports = Router;
