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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [permissionCheckLoading, setPermissionCheckLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user && user.email) {
        setPermissionCheckLoading(true);
        try {
          // STRICT CHECK: Only look for existing document in Firestore
          // Collection: allowed_users
          // Document ID: user's email
          const userRef = doc(db, "allowed_users", user.email);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Check if the 'active' field is true
            if (data.active === true) {
              console.log("User authorized:", user.email);
              setIsWhitelisted(true);
            } else {
              console.log("User exists but is inactive:", user.email);
              setIsWhitelisted(false);
            }
          } else {
            // Document does not exist -> User is not pre-filled -> DENY
            console.log("User not found in whitelist:", user.email);
            setIsWhitelisted(false);
          }
        } catch (error) {
          console.error("Error checking permissions:", error);
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
};