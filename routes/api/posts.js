const express = require('express');
const router = express.Router();


//GET route: /api/posts/test
router.get('/test', (req,res) => res.json({msg:'Posts works'}));

module.exports = router;