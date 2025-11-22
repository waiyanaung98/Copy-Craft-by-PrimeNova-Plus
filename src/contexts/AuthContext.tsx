import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isWhitelisted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// USER WHITELIST (လူပုဂ္ဂိုလ် ခွင့်ပြုစာရင်း)
// ==========================================
// Add authorized Gmail addresses here.
// Only emails in this list can access the app.
// နောက်ပိုင်း လူထပ်ထည့်ချင်ရင် ဒီမှာ Email ထပ်ဖြည့်ပြီး Save လိုက်ပါ။
const ALLOWED_EMAILS = [
  'waiyanlarge@gmail.com',
  'waiyanaung.mkt@gmail.com', // <--- Added specifically for you
  'admin@gmail.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        // Check if email exists in the allowed list (case-insensitive and trimmed)
        const userEmail = user.email.toLowerCase().trim();
        const allowed = ALLOWED_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);
        setIsWhitelisted(allowed);
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
      // alert("Failed to sign in. Please check your popup blocker or try again.");
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
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