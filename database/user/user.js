const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: [
        { type: String }]
}, { timestamps: true });


// check the email and phoneNumber is/not matching
UserSchema.statics.checkEmail = async ({ email }) => {

    const checkUserByEmail = await UserModel.findOne({ email });
    // const checkUserByPhone = await UserModel.findOne({ phoneNumber });

    if (checkUserByEmail) {
        throw new Error("User already Exists");
    };
};

// check if the user is authorized
// UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {

//     const user = await UserModel.findOne({ email });
//     if (!user) {
//         throw new Error("User doesnot exist!");
//     }

//     const checkPassword = await bcrypt.compare(password, user.password);

//     if (!checkPassword) {
//         throw new Error("Invalid Credentials!");
//     };
// };


UserSchema.pre('save', async function (next) {

    const user = this;

    // password is not modified
    if (!user.isModified("password")) return next();

    // generating bcrypt salt
    const salted = await bcrypt.genSalt(10);
    // hashing password
    const hash_password = await bcrypt.hash(user.password, salted);
    // assigning the hash password
    user.password = hash_password;
    return next();

});


// generating jwt token
UserSchema.methods.generateJwt = async function () {

    try {
        return jwt.sign({ user: this._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }

}

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel