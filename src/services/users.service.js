import usersModel from "../models/users.model.js"

// findByID
const findByID = (id) => {
    return usersModel.findById(id)
};

export default { findByID };