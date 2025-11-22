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
  permissionCheckLoading: boolean;
  isPending: boolean;
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
          // Reference to the specific user document in 'allowed_users' collection
          // Document ID is the email address
          const userRef = doc(db, "allowed_users", user.email);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            // User exists in DB, check if they are active
            const data = docSnap.data();
            if (data.active === true) {
              setIsWhitelisted(true);
              setIsPending(false);
            } else {
              // User is in DB but active is false (or missing)
              setIsWhitelisted(false);
              setIsPending(true); // Pending Admin Approval
            }
          } else {
            // User DOES NOT exist -> Auto Request Access
            // Create document with active: false
            await setDoc(userRef, {
              email: user.email,
              active: false,
              createdAt: new Date().toISOString(),
              displayName: user.displayName,
              photoURL: user.photoURL
            });
            
            setIsWhitelisted(false);
            setIsPending(true); // Automatically pending
          }
        } catch (error) {
          console.error("Error verifying user in database:", error);
          // On error, deny access for safety
          setIsWhitelisted(false);
          setIsPending(false);
        } finally {
          setPermissionCheckLoading(false);
        }
      } else {
        // No user logged in
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
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isWhitelisted, permissionCheckLoading, isPending }}>
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