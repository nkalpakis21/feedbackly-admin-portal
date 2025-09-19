// Script to update existing user document with uid field
// Run this in the browser console on your admin portal

// Replace this with your actual Firebase UID
const firebaseUID = 'YOUR_FIREBASE_UID_HERE'; // Get this from Firebase Auth

// Replace this with your actual user document ID
const userDocId = 'YOUR_USER_DOC_ID_HERE'; // Get this from Firestore

// Update the user document
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

async function updateUserUID() {
  try {
    const userRef = doc(db, 'users', userDocId);
    await updateDoc(userRef, {
      uid: firebaseUID
    });
    console.log('✅ User document updated with UID');
  } catch (error) {
    console.error('❌ Error updating user document:', error);
  }
}

updateUserUID();
