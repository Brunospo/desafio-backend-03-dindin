const securePassword = require('secure-password');
const { query } = require('../config/connection');

const pwd = securePassword();

const encryptPassword = async (password) => {

  try {
    const hash = await pwd.hash(Buffer.from(password));
    const hashString = hash.toString("hex");

    return hashString;

  } catch (error) {
    throw new Error(`securePassword: ${error}`);
  }
}

const isValidPassword = async (password, hashPassword, email) => {
  try {
    const result = await pwd.verify(Buffer.from(password), Buffer.from(hashPassword, "hex"));

    switch (result) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return false;
      case securePassword.VALID:
        return true;
      case securePassword.VALID_NEEDS_REHASH:
          try {
            const hashString = await encryptPassword(password)        
            await query('UPDATE usuarios set senha = $1 WHERE email = $2', [ hashString, email]);
            return true;
        } catch {
          //ignore
        }
        break;
    }
  } catch (error) {
    throw new Error(`securePassword: ${error}`);
  }
};

module.exports = {
  encryptPassword,
  isValidPassword
};