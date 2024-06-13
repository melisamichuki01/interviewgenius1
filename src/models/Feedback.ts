import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  intervieweeName: String,
  feedback: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
