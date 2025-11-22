import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isWhitelisted: boolean;
  isPending: boolean;
  permissionCheckLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Collection Name to check in Firestore
const COLLECTION_NAME = "allowed_users";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [permissionCheckLoading, setPermissionCheckLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthError(null);
      setIsWhitelisted(false);
      setIsPending(false);
      
      if (user && user.email) {
        setPermissionCheckLoading(true);
        const emailKey = user.email.toLowerCase().trim(); // Use consistent casing

        try {
          console.log(`Checking Firestore: ${COLLECTION_NAME} for ${emailKey}`);
          
          const userRef = doc(db, COLLECTION_NAME, emailKey);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.active === true) {
              console.log("Access Granted.");
              setIsWhitelisted(true);
            } else {
              console.log("User exists but active is false (Pending).");
              setIsPending(true);
            }
          } else {
            // AUTO-REQUEST: Create the document if it doesn't exist
            console.log("User not found. Creating request...");
            try {
              await setDoc(userRef, {
                active: false,
                email: user.email,
                createdAt: new Date().toISOString()
              });
              console.log("Request created.");
              setIsPending(true);
            } catch (createErr: any) {
              console.error("Error creating user request:", createErr);
              setAuthError("Could not create account request. Check database permissions.");
            }
          }
        } catch (error: any) {
          console.error("Firestore Error:", error);
          if (error.code === 'permission-denied') {
            setAuthError("Database Permission Denied. Please check Firestore Security Rules.");
          } else {
            setAuthError(error.message || "Error connecting to database.");
          }
        } finally {
          setPermissionCheckLoading(false);
        }
      } else {
        setPermissionCheckLoading(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in", error);
      setAuthError(error.message);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setIsWhitelisted(false);
      setIsPending(false);
      setAuthError(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isWhitelisted, isPending, permissionCheckLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}