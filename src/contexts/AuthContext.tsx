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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COLLECTION_NAME = "allowed_users";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [permissionCheckLoading, setPermissionCheckLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsWhitelisted(false);
      
      if (user && user.email) {
        setPermissionCheckLoading(true);
        // Ensure lowercase for consistent matching
        const emailKey = user.email.toLowerCase().trim();

        try {
          // Check directly in Firestore Database
          // Path: allowed_users/{email}
          const userRef = doc(db, COLLECTION_NAME, emailKey);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists() && docSnap.data().active === true) {
             // User is found AND active is set to true
             setIsWhitelisted(true);
          } else {
             // User not found OR active is false
             setIsWhitelisted(false);
             console.log("Access Denied: Email not found in 'allowed_users' collection or inactive:", emailKey);
          }
        } catch (error) {
          console.error("Database Check Error:", error);
          setIsWhitelisted(false);
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
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setIsWhitelisted(false);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isWhitelisted, permissionCheckLoading }}>
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