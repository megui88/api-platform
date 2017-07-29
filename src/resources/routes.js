let express = require('express');
let platform = require('./PlatformService');
let router = express.Router();

/* GET platforms listing. */
router.get('/', (req, res, next) => {
    platform.all()
        .then(data => {
            res.json(data);
        })
        .catch(next);
});

/* POST platform create. */
router.post('/', (req, res, next) => {
    platform.create(req.body)
        .then(data => {
            res.status(201);
            res.json(data);
        })
        .catch(next);
});

/* GET platform listing. */
router.get('/:id', (req, res, next) => {
    platform.get(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(next);
});

/* PUT/PATCH platform update. */
router.put('/:id', update);
router.patch('/:id', update);

function update(req, res, next) {
    platform.update(req.params.id, req.body)
        .then(data => {
            res.json(data);
        })
        .catch(next);
}

module.exports = router;
