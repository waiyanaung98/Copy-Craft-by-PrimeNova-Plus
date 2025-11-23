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
      setLoading(true); // Keep loading while fetching whitelist

      if (user && user.email) {
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
            console.error("Whitelist document not found in Firestore (admin_settings/whitelisted_emails)");
            setIsWhitelisted(false);
          }
        } catch (error) {
          console.error("Error fetching whitelist:", error);
          // If error (e.g. permission denied), fail safely
          setIsWhitelisted(false);
        }
      } else {
        setIsWhitelisted(false);
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