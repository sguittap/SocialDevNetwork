const express = require('express');
const router = express.Router();


//GET route: /api/users/test
router.get('/test', (req,res) => res.json({msg:'Users works'}));

module.exports = router;