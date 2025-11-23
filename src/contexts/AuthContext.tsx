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
  checkPermission: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  // Function to check database permissions
  const checkDatabasePermission = async (user: User) => {
    if (!user.email) return;
    
    try {
      // Reference to: admin_settings -> whitelisted_emails
      const docRef = doc(db, 'admin_settings', 'whitelisted_emails');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const allowedEmails: string[] = data.emails || [];
        
        // Check if user's email is in the array (case insensitive)
        const isAllowed = allowedEmails.some(
          email => email.trim().toLowerCase() === user.email!.trim().toLowerCase()
        );

        setIsWhitelisted(isAllowed);
      } else {
        console.error("Whitelist document not found in Firestore!");
        setIsWhitelisted(false);
      }
    } catch (error) {
      console.error("Error fetching whitelist:", error);
      setIsWhitelisted(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkDatabasePermission(user);
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
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      signInWithGoogle, 
      logout, 
      isWhitelisted,
      checkPermission: async () => { if(currentUser) await checkDatabasePermission(currentUser); }
    }}>
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