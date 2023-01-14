const express = require('express');
const router = express.Router();

const { getAllPersons, addPerson, searchPerson, wildCardSearch, updatePerson, deletePerson, sortPages } = require('./controller');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', getAllPersons);
router.get('/search', searchPerson);
router.get('/wildcard', wildCardSearch);
router.get('/sort/:field/:page/:desc?', sortPages)

router.post('/', addPerson);

router.patch('/', updatePerson);

router.delete('/:phone', deletePerson);

module.exports = router;