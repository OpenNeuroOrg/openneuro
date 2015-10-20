// dependencies ------------------------------------

import users   from './users';
import express from 'express';
let router = express.Router();

// users -------------------------------------------

router.post('/users', users.create);
router.post('/users/blacklist', users.blacklist);
router.get('/users/blacklist', users.getBlacklist);

// export ------------------------------------------

export default router;