require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const cookieParser = require('cookie-parser');

//Database Connection
const ConnectDb = require('./database/DBConnection/conn');

//config
const googleAuthConfig = require("./Config/google.config");
const routeConfig = require("./Config/route.config");

//API integration
const Auth = require('./API/Auth/index');
const User =  require('./API/User/index');
const Restaurant = require('./API/Restaurant/index');
const Food = require('./API/Food/index');
const Menu = require('./API/Menu/index');
const Image = require('./API/Image/index');
const MenuImage = require('./API/MenuImage/index');
const Review = require('./API/Review/index');
const Order = require('./API/Order/index');

const zomato = express();

zomato.use(express.json());
zomato.use(express.urlencoded({ extrended: false }));
zomato.use(helmet());
zomato.use(cors());
zomato.use(cookieParser());
zomato.use(passport.initialize());

//passport config
googleAuthConfig(passport);
routeConfig(passport);

zomato.use("/auth", Auth);
zomato.use("/user", User);
zomato.use("/restaurant", Restaurant);
zomato.use("/food", Food);
zomato.use("/menu", Menu);
zomato.use("/image", Image);
zomato.use("/menuimage", MenuImage);
zomato.use("/review", Review);
zomato.use("/order", Order);

zomato.listen(process.env.PORT || '3001', () => {
    if (ConnectDb()) {
        console.log("Server is running and connected!");
    } else {
        console.log("Db connect to failed!");
    }
});    