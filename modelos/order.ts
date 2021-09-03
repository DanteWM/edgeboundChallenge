import mongoose, { Schema } from 'mongoose';

const orderSchema: Schema = new Schema({
  orderid: { type: String, required: true, unique: true },
  status: { type: String, enum: ['PROCESS', 'CANCELLED', 'PICKING', 'SHIPPING', 'CLOSED'], required: true },
  description: { type: String },
  trackingUrls: { type: Array },
  trackingCodes: { type: Array },
  timestamp: { type: Date },
}, { collection: 'orders' });

export default mongoose.model('Order', orderSchema);
