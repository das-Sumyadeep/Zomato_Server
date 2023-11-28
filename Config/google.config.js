
const googleOAuth = require("passport-google-oauth20");

const UserModel = require("../database/user/user");

const GoogleStrategy = googleOAuth.Strategy;

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            
        },
            async (accessToken, refreshToken, profile, done) => {
                //    done(null, profile)
                const newUser = {
                    fullname: profile.displayName,
                    email: profile.emails[0].value
                };
                try {
                    const user = await UserModel.findOne({ email: newUser.email });
                    if (user) {
                        const token = await user.generateJwt();
                        done(null, { user, token });
                    } else {
                        const user = await UserModel.create(newUser);
                        const token = await user.generateJwt();
                        done(null, { user, token });
                    }
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );

    passport.serializeUser((userData, done) => done(null, { ...userData }));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

};
