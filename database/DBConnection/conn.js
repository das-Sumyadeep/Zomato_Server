
const mongoose = require('mongoose');

const database = async () => {

    return await mongoose.connect(process.env.MONGO_URL);

};
module.exports = database;