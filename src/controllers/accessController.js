const { AccessRequest, Document, User } = require('../models');

const requestAccess = async (req, res) => {
  const documentId = req.params.id;
  const doc = await Document.findById(documentId);
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  const existing = await AccessRequest.findOne({ userId: req.user.id, documentId });
  if (existing) return res.status(409).json({ message: 'Access already requested' });

  const ar = await AccessRequest.create({ userId: req.user.id, documentId });
  res.status(201).json(ar);
};

const listRequests = async (req, res) => {
  // Admin: list all
  if (req.user.role === 'ADMIN') {
    const reqs = await AccessRequest.find().sort({ createdAt: -1 }).populate('userId documentId');
    return res.json(reqs);
  }

  // User: list own requests
  const reqs = await AccessRequest.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate('documentId');
  res.json(reqs);
};

const reviewRequest = async (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body; // 'APPROVE' or 'REJECT'
  const ar = await AccessRequest.findById(requestId);
  if (!ar) return res.status(404).json({ message: 'Request not found' });
  if (ar.status !== 'PENDING') return res.status(409).json({ message: 'Request already reviewed' });

  if (!['APPROVE', 'REJECT'].includes(action)) return res.status(400).json({ message: 'action must be APPROVE or REJECT' });

  ar.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  ar.reviewedBy = req.user.id;
  await ar.save();
  res.json(ar);
};

module.exports = { requestAccess, listRequests, reviewRequest };
