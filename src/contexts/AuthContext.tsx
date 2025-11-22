import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isWhitelisted: boolean;
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
  const [permissionCheckLoading, setPermissionCheckLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthError(null);
      
      if (user && user.email) {
        setPermissionCheckLoading(true);
        const emailKey = user.email.toLowerCase().trim(); // Ensure consistent casing

        try {
          console.log(`Checking Firestore Collection: ${COLLECTION_NAME} for Doc ID: ${emailKey}`);
          
          const userRef = doc(db, COLLECTION_NAME, emailKey);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.active === true) {
              console.log("Access Granted.");
              setIsWhitelisted(true);
            } else {
              console.log("User found but active != true");
              setAuthError("Account is inactive. Please ask admin to set active: true");
              setIsWhitelisted(false);
            }
          } else {
            console.log("Document not found.");
            setAuthError(`Email not found in '${COLLECTION_NAME}' database.`);
            setIsWhitelisted(false);
          }
        } catch (error: any) {
          console.error("Firestore Error:", error);
          // Handle permission errors (common if rules are locked)
          if (error.code === 'permission-denied') {
            setAuthError("Database Permission Denied. Please check Firestore Security Rules.");
          } else {
            setAuthError(error.message || "Error connecting to database.");
          }
          setIsWhitelisted(false);
        } finally {
          setPermissionCheckLoading(false);
        }
      } else {
        setIsWhitelisted(false);
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
      setAuthError(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isWhitelisted, permissionCheckLoading, authError }}>
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