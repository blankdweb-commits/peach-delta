import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        alias: 'Nurse_' + Math.floor(Math.random() * 1000), // Random Alias
                    }
                }
            });
            if (error) throw error;
            alert('Check your email for the login link!');
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>{isSignUp ? 'Join Peach Delta 🍑' : 'Sign In'}</h2>
      <p>Connect with nurses in Delta State.</p>

      <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{padding: '10px'}}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{padding: '10px'}}
        />
        <button type="submit" disabled={loading} style={{padding: '10px', backgroundColor: '#FF7F50', color: 'white', border: 'none', cursor: 'pointer'}}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>

      <p style={{marginTop: '20px', textAlign: 'center'}}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"} <br/>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}
          >
              {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
      </p>
    </div>
  );
}
