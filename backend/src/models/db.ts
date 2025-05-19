import mongoose, { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
});

const ContentSchema = new Schema({
  title: String,
  LinK: String,
  tags: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'tags',
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

export const UserModel = model('User', UserSchema);
export const contentModel = model('Content', ContentSchema);
export const LinkModel = model('Links', LinkSchema);
