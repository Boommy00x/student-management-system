const express = require('express');
const router = express.Router();

const wows = require('../src/data/wows');

// GET all students or filter by name /students
router.get('/', (req, res) => {
  const { name } = req.query;

  let result = wows;
  if (name) {
    result = wows.filter(s =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  res.json({
    ok: true,
    count: result.length,
    query: req.query,
    data: result,
  });
});

module.exports = router;