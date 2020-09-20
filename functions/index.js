const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateSlot = functions.https.onRequest(async (req, res) => {
  const locationName = req.query.location;
  const slotName = req.query.slot;
  const updateStatus = (req.query.status === '0');
  const writeResult = await admin.firestore().collection('location').doc(locationName).collection('slots').doc(slotName).update({availability: updateStatus});
  res.json({result: `Write Successful`});
});