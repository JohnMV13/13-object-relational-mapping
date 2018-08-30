'use strict';

import mongoose, { Schema } from 'mongoose';

const pathSchema = Schema({
  name: { type: String, required: true},
  family: { type: String, required: true},
  retailer: { type: String},
});

const Paths = mongoose.models.instrument || mongoose.model('path', instrumentSchema);

export default Paths;