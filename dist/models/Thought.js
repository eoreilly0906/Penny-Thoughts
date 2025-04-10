import { Schema, model, Types } from 'mongoose';
const reactionSchema = new Schema({
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
}, {
    toJSON: {
        getters: true,
        transform: function (_doc, ret) {
            if (ret.createdAt) {
                ret.createdAt = ret.createdAt.toLocaleDateString();
            }
            return ret;
        }
    },
    id: false
});
const thoughtSchema = new Schema({
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
}, {
    toJSON: {
        virtuals: true,
        getters: true,
        transform: function (_doc, ret) {
            if (ret.createdAt) {
                ret.createdAt = ret.createdAt.toLocaleDateString();
            }
            return ret;
        }
    },
    id: false
});
// Create a virtual property `reactionCount` that gets the length of the thought's reactions array
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});
const Thought = model('Thought', thoughtSchema);
export default Thought;
