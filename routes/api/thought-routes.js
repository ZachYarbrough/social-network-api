const router = require('express').Router();
const { User, Thought } = require('../../models');

router.get('/', (req, res) => {
    Thought.find({})
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.json(err));
});

router.get('/:id', (req, res) => {
    Thought.findOne({ _id: req.params.id })
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: 'No thought with that id.' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
});

router.post('/', (req, res) => {
    Thought.create(req.body)
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: 'No thought with that id.' });
                return;
            }
            return User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts : thoughtData._id } }, { new: true })
        })
        .then(userData => {
            if(!userData) {
                res.status(404).json({ message: 'No user with that id.' });
                return;
            }
            res.json(userData);
        })
        .catch(err => res.json(err));
});

router.put('/:id', (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: 'No thought with that id.' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
});

router.delete('/:id', (req, res) => {   
    Thought.findOneAndDelete({ _id: req.params.id })
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: 'No thought with that id.' });
                return;
            }
            return User.findOneAndUpdate({ _id: req.body.userId }, { $pull: { thoughts : thoughtData._id } }, { new: true })
        })
        .then(userData => {
            if(!userData) {
                res.status(404).json({ message: 'No user with that id.' });
                return;
            }
            res.json(userData);
        })
        .catch(err => res.json(err));
});

router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId}, { $push: {reactions: req.body } }, { new: true })
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: 'No thought with that id.' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
});

router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId}, { $pull: { reactions: { _id: req.params.reactionId } } })
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: 'No thought with that id.' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
});

module.exports = router;