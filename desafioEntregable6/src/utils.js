// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// export default __dirname

import bcrypt from 'bcryptjs'

export const hashedPassword = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)