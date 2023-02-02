const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
admin.initializeApp();
const db = admin.firestore();

exports.lists = functions.https.onRequest(async (req, res) => {
  switch (req.method) {
    case 'POST':
      try {
        const data = req.body;
        const documentExists = await db.collection('lists').doc(data.id).get();
        if (documentExists.exists) throw new Error('document already existing');
        const [adminKey, shareKey] = await Promise.all([
          bcrypt.hash(data.adminKey, 10),
          bcrypt.hash(data.adminKey, 10),
        ]);
        data.adminKey = adminKey;
        data.shareKey = shareKey;
        await Promise.all([
          db.collection('lists').doc(data.id).set(data),
          db
            .collection('items')
            .doc(`items-${data.id}`)
            .set({data: [], shareKey}),
        ]);
        res.status(200).json({status: 'success'});
      } catch (e) {
        res.status(500).json({status: 'failed', error: e});
      }
      break;
    case 'DELETE':
      const {id, reqAdminKey} = req.body;
      try {
        const doc = await db.collection('lists').doc(id).get();
        const compare = await bcrypt.compare(reqAdminKey, doc.data().adminKey);
        if (compare) {
          await Promise.all([
            db.collection('lists').doc(id).delete(),
            db.collection('items').doc(`items-${id}`).delete(),
          ]);
          res.status(200).json({status: 'success'});
        } else {
          res.status(200).json({status: 'unauthorized'});
        }
      } catch (e) {
        res.status(500).json({status: 'server error', error: e});
      }
      break;
    default:
      res.send('thank you for sending');
      break;
  }
});

exports.items = functions.https.onRequest(async (req, res) => {
  switch (req.method) {
    case 'GET':
      const {id, shareKey} = req.query;
      try {
        const doc = await db.collection('items').doc(`items-${id}`).get();
        const compare = bcrypt.compare(shareKey, doc.data().shareKey);
        if (compare) {
          res.status(200).json({data: doc.data().data});
        } else {
          res.status(401).json({message: 'unauthorized'});
        }
      } catch (e) {
        res.status(500).send('server error', e);
      }
      break;
    case 'POST':
      const {reqId, reqShareKey, reqData} = req.body;
      try {
        const doc = await db.collection('items').doc(`items-${reqId}`).get();
        const compare = bcrypt.compare(reqShareKey, doc.data().shareKey);
        if (compare) {
          await db
            .collection('items')
            .doc(`items-${reqId}`)
            .update({data: reqData});
          res.status(200).json({message: 'success'});
        } else {
          res.status(401).json({message: 'unauthorized'});
        }
      } catch (e) {
        res.status(500).send('server error', e);
      }
      break;
    default:
      res.status(200).send('thank you for sending');
  }
});
