const express = require('express');
const router = express.Router();


//GET route: /api/profile/test
router.get('/test', (req,res) => res.json({msg:'Profile works'}));

module.exports = router;