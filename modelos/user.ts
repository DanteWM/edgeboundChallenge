import mongoose, { Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  salt: { type: String },
  role: { type: String, enum: ['ADMIN', 'USER'] },
}, { collection: 'users' });

export default mongoose.model('User', userSchema);
