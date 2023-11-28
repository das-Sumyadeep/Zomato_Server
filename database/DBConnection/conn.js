
const mongoose = require('mongoose');

const database = async () => {

    try {
        return await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error);
    }

};
module.exports = database;
