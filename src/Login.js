import React, { useState } from 'react';
// NEW: Import updateProfile to save the user's name
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Login = () => {
  const [name, setName] = useState(''); // NEW: State for the name input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true);

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSigningUp) {
        // Step 1: Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // NEW: Step 2: Update their profile with the name they provided
        await updateProfile(userCredential.user, {
          displayName: name
        });

      } else {
        // Sign in an existing user (no changes here)
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isSigningUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {/* NEW: This input field only appears when signing up */}
        {isSigningUp && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">{isSigningUp ? 'Sign Up' : 'Login'}</button>
        {error && <p className="error-message">{error}</p>}
        <p className="toggle-form" onClick={() => setIsSigningUp(!isSigningUp)}>
          {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

export default Login;