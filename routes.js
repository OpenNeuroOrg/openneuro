// dependencies ------------------------------------

import express from 'express';
import users   from './handlers/users';
import jobs    from './handlers/jobs';

let router = express.Router();

// users -------------------------------------------

router.post('/users', users.create);
router.post('/users/blacklist', users.blacklist);
router.get('/users/blacklist', users.getBlacklist);
router.delete('/users/blacklist/:id', users.unBlacklist);

// jobs --------------------------------------------

router.post('/jobs', jobs.create);
router.post('/jobs/results', jobs.results);

// export ------------------------------------------

export default router;