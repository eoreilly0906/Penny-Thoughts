import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import Thought from '../models/Thought.js';
import User from '../models/User.js';

const router = express.Router();

// GET all thoughts
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const thoughts = await Thought.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by _id
router.get('/:thoughtId', async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v');
    
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.create(req.body);
    
    // Push the created thought's _id to the associated user's thoughts array field
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $push: { thoughts: thought._id } },
      { new: true }
    );
    
    if (!user) {
      res.status(404).json({ message: 'No user found with this username!' });
      return;
    }
    
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a thought by _id
router.put('/:thoughtId', async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by _id
router.delete('/:thoughtId', async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    
    // Remove the thought from the user's thoughts array
    await User.findOneAndUpdate(
      { username: thought.username },
      { $pull: { thoughts: thought._id } }
    );
    
    res.json({ message: 'Thought deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array
router.post('/:thoughtId/reactions', async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    );
    
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: new Types.ObjectId(req.params.reactionId) } } },
      { runValidators: true, new: true }
    );
    
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router; 