// dependencies ------------------------------------

import users   from './handlers/users';
import express from 'express';
let router = express.Router();

// users -------------------------------------------

router.post('/users', users.create);
router.post('/users/blacklist', users.blacklist);
router.get('/users/blacklist', users.getBlacklist);
router.delete('/users/blacklist/:id', users.unBlacklist);

// export ------------------------------------------

export default router;