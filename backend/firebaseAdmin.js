const admin = require("firebase-admin");
const path = require("path");

// TODO: Download your serviceAccountKey.json from Firebase Console
// (Project Settings > Service Accounts > Generate new private key)
// Place it in the 'backend' folder and make sure it's named 'serviceAccountKey.json'
try {
  const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialized successfully.");
} catch (error) {
  console.warn("WARNING: serviceAccountKey.json not found or invalid. Firebase Admin SDK not initialized.");
  console.warn("Please download it from Firebase Console and place it in the backend folder.");
}

module.exports = admin;
