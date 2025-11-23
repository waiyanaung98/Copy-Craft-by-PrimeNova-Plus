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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user && user.email) {
        setLoading(true);
        try {
          // Reference to: collection "admin_settings" -> document "whitelisted_emails"
          const docRef = doc(db, "admin_settings", "whitelisted_emails");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Expecting a field named 'emails' which is an array of strings
            const allowedEmails: string[] = data.emails || [];
            
            // Check if user email is in the array (case insensitive)
            const isAllowed = allowedEmails.some(
              (email) => email.trim().toLowerCase() === user.email!.trim().toLowerCase()
            );
            
            setIsWhitelisted(isAllowed);
            console.log(`User ${user.email} whitelist status: ${isAllowed}`);
          } else {
            console.error("Whitelist document not found. Please create 'admin_settings/whitelisted_emails' in Firestore.");
            // Fail safe: Deny access if DB is not set up, BUT allow hardcoded owner for setup
            if (user.email === 'waiyanlarge@gmail.com') {
               setIsWhitelisted(true);
            } else {
               setIsWhitelisted(false);
            }
          }
        } catch (error) {
          console.error("Error fetching whitelist from Firestore:", error);
          setIsWhitelisted(false);
        }
        setLoading(false);
      } else {
        setIsWhitelisted(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Error: Please check if your domain is authorized in Firebase Console.");
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
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logout, isWhitelisted }}>
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