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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [permissionCheckLoading, setPermissionCheckLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user && user.email) {
        setPermissionCheckLoading(true);
        try {
          // 1. Check if user exists in Firestore 'allowed_users' collection
          const userRef = doc(db, "allowed_users", user.email);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            // User exists - check if they are active
            const data = docSnap.data();
            if (data.active === true) {
              setIsWhitelisted(true);
              setIsPending(false);
            } else {
              // Exist but not active -> Pending
              setIsWhitelisted(false);
              setIsPending(true);
            }
          } else {
            // User DOES NOT exist -> Auto-Request Access
            // Create the document with active: false
            await setDoc(userRef, {
              email: user.email,
              active: false, // Default to false, waiting for admin
              createdAt: new Date().toISOString(),
              displayName: user.displayName || '',
              photoURL: user.photoURL || ''
            });
            
            // Set state to pending
            setIsWhitelisted(false);
            setIsPending(true);
          }
        } catch (error) {
          console.error("Error checking user permissions:", error);
          setIsWhitelisted(false);
          setIsPending(false);
        } finally {
          setPermissionCheckLoading(false);
        }
      } else {
        // Not logged in
        setIsWhitelisted(false);
        setIsPending(false);
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
      setIsPending(false);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isWhitelisted, isPending, permissionCheckLoading }}>
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
};