'use strict';

import mongoose, { Schema } from 'mongoose';

const pathSchema = Schema({
  name: { type: String, required: true},
  family: { type: String, required: true},
  retailer: { type: String},
});

const Path = mongoose.models.instrument || mongoose.model('path', pathSchema);
mongoose.model('path', pathSchema, 'path');

Path.route = 'path';

export default Path;