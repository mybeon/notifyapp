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
          bcrypt.hash(data.shareKey, 10),
        ]);
        data.adminKey = adminKey;
        data.shareKey = shareKey;
        data.items = [];
        await db.collection('lists').doc(data.id).set(data),
          res.status(200).json({status: 'success'});
      } catch (e) {
        res.status(500).json({status: 'failed', error: e});
      }
      break;
    case 'PUT':
      const {reqId, reqShareKey, reqData} = req.body;
      try {
        const doc = await db.collection('lists').doc(reqId).get();
        const compare = bcrypt.compare(reqShareKey, doc.data().shareKey);
        if (compare) {
          console.log('we run');
          await db.collection('lists').doc(reqId).update({items: reqData});
          res.status(200).json({message: 'success'});
        } else {
          res.status(401).json({message: 'unauthorized'});
        }
      } catch (e) {
        res.status(500).json({error: e});
      }
      break;
    case 'DELETE':
      const {id, reqAdminKey} = req.body;
      try {
        const doc = await db.collection('lists').doc(id).get();
        const compare = await bcrypt.compare(reqAdminKey, doc.data().adminKey);
        if (compare) {
          await db.collection('lists').doc(id).delete();
          res.status(200).json({status: 'success'});
        } else {
          res.status(200).json({status: 'unauthorized'});
        }
      } catch (e) {
        res.status(500).json({status: 'server error', error: e});
      }
      break;
    case 'GET':
      if (req.query.type === 'single') {
        const {id, shareKey} = req.query;
        try {
          const doc = await db.collection('lists').doc(id).get();
          const compare = bcrypt.compare(shareKey, doc.data().shareKey);
          if (compare) {
            res.status(200).json({...doc.data()});
          } else {
            res.status(401).json({message: 'unauthorized'});
          }
        } catch (e) {
          res.status(500).json({error: e});
        }
      } else {
        const queries = [];
        const lists = [];
        const idsToDelete = [];
        req.query.lists.forEach(id => {
          queries.push(db.collection('lists').doc(id).get());
        });
        try {
          const documents = await Promise.all(queries);
          documents.forEach(doc => {
            if (doc.exists) {
              const data = doc.data();
              delete data.items;
              delete data.shareKey;
              delete data.adminKey;
              lists.push(data);
            } else {
              idsToDelete.push(doc.id);
            }
          });
          console.log(lists);
          res.status(200).json({lists, idsToDelete});
        } catch (e) {
          res.status(500).json({error: e});
        }
      }
      break;
    default:
      res.send('thank you for sending');
      break;
  }
});
