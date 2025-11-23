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
        // User is logged in, now check the database whitelist
        try {
          // Reference to: collection "admin_settings" -> document "whitelisted_emails"
          const docRef = doc(db, "admin_settings", "whitelisted_emails");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // The field in Firestore is named "emails" (Array of strings)
            const allowedEmails: string[] = data.emails || [];
            
            console.log("Checking whitelist for:", user.email);
            
            // Check if user email is in the array (case insensitive)
            const isAllowed = allowedEmails.some(
              (email) => email.trim().toLowerCase() === user.email!.trim().toLowerCase()
            );
            
            setIsWhitelisted(isAllowed);
          } else {
            console.error("Whitelist document (admin_settings/whitelisted_emails) not found in Firestore.");
            // Default to false if config is missing for security
            setIsWhitelisted(false);
          }
        } catch (error) {
          console.error("Error fetching whitelist from Firestore:", error);
          setIsWhitelisted(false);
        }
      } else {
        // Not logged in
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