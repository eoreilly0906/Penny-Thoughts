import { Schema, model, Types, Document } from 'mongoose';

interface IReaction {
  reactionId: Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  reactions: IReaction[];
  reactionCount: number;
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      getters: true,
      transform: function(doc, ret) {
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toLocaleDateString();
        }
        return ret;
      }
    },
    id: false
  }
);

const thoughtSchema = new Schema<IThought>(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
      transform: function(doc, ret) {
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toLocaleDateString();
        }
        return ret;
      }
    },
    id: false
  }
);

// Create a virtual property `reactionCount` that gets the length of the thought's reactions array
thoughtSchema.virtual('reactionCount').get(function(this: IThought) {
  return this.reactions.length;
});

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought; 