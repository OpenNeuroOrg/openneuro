// dependencies ------------------------------------

import users   from './users';
import express from 'express';
let router = express.Router();

// users -------------------------------------------

router.post('/users', users.create);

// export ------------------------------------------

export default router;