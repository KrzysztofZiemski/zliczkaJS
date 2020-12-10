const bcrypt = require('bcryptjs');
const config = require('../../config.json');

const hashPassword = async (user) => {
    const salt = await bcrypt.genSaltSync(config.HASH_ROUND);
    const password = await bcrypt.hashSync(user.password, salt);
    return { salt, password }
}
const checkPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password_hash);
}
module.exports = { hashPassword, checkPassword }