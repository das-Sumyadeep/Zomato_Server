const JwtPassport = require('passport-jwt');

const UserModel = require('../database/user/user');


const JwtStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "ZomatoApp"

}

module.exports = (passport) => {

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {

        try {

            const userData = await UserModel.findById({ _id: jwt_payload.user });
            
            if (userData) {

                return done(null, userData);
            }
            else
                return done(null, false);

        } catch (err) {
            
            return done(err, false);
        }
    }));
}

