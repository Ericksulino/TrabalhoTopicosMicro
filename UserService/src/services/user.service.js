const User = require("../models/User");

const createService = (body) => User.create(body);

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id);

const findByEmail = (email) => User.findOne({email: email});

const updateService = (
        id,
        name,
        email,
        number,
        password,

) => User.findOneAndUpdate({_id: id},{
    name,
    email,
    number,
    password, 
});

module.exports = {
    createService,
    findAllService,
    findByEmail,
    findByIdService,
    updateService,
};