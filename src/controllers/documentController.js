const path = require('path');
const fs = require('fs');
const { Document, AccessRequest } = require('../models');

const uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File required' });
  const { description } = req.body;
  const doc = await Document.create({ filename: req.file.filename, originalName: req.file.originalname, description, uploadedBy: req.user.id });
  res.status(201).json(doc);
};

const listDocuments = async (req, res) => {
  const docs = await Document.find().sort({ createdAt: -1 });

  // For each document, include access status for requesting user if a USER
  const withAccess = await Promise.all(docs.map(async (d) => {
    const item = d.toObject();
    if (req.user.role === 'USER') {
      const ar = await AccessRequest.findOne({ userId: req.user.id, documentId: d._id });
      item.access = ar ? ar.status : 'NONE';
    }
    return item;
  }));

  res.json(withAccess);
};

const downloadDocument = async (req, res) => {
  const docId = req.params.id;
  const doc = await Document.findById(docId);
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  // Business rule: only allow download when user has approved access
  if (req.user.role === 'USER') {
    const ar = await AccessRequest.findOne({ userId: req.user.id, documentId: doc._id, status: 'APPROVED' });
    if (!ar) return res.status(403).json({ message: 'Download forbidden: access not approved' });
  }

  const filePath = path.resolve(__dirname, '../../uploads', doc.filename);
  if (!fs.existsSync(filePath)) return res.status(410).json({ message: 'File missing on server' });

  res.download(filePath, doc.originalName);
};

module.exports = { uploadDocument, listDocuments, downloadDocument };
