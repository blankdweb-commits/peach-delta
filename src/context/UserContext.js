import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Auth from '../components/Auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [currentView, setCurrentView] = useState('discover');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // 2. Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
          setUser(null);
          setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Profile Data
  const fetchProfile = async (userId) => {
      try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error && error.code !== 'PGRST116') { // Ignore "No Rows Found" initially
               console.error('Error fetching profile:', error);
          }

          if (data) {
              // Get Daily Count (Mocking locally for performance or could fetch count from actions table)
              // For robustness, let's fetch the count via RPC or separate query
              // For now, we will rely on the backend RPC 'attempt_ripen' to enforce limits,
              // but we need to show the count in UI.
              const { count } = await supabase
                .from('user_actions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('action_type', 'ripen')
                .eq('action_date', new Date().toISOString().split('T')[0]);

              setUser({
                  ...data,
                  dailyRipenCount: count || 0,
                  adPreferences: { allowAds: data.ad_preferences_allow_ads }
              });
          } else {
              // Create default profile if missing (trigger usually handles this, but doing manual just in case)
              // Actually, triggers are best. But let's set a local default while loading.
              setUser({
                  id: userId,
                  membershipTier: 'free',
                  dailyRipenCount: 0,
                  adPreferences: { allowAds: true }
              });
          }

          fetchAds();
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const fetchAds = async () => {
      const { data } = await supabase.from('ads').select('*');
      if (data) setAds(data);
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const upgradeMembership = async (tier) => {
    if (!user) return;

    const { error } = await supabase
        .from('profiles')
        .update({ membership_tier: tier })
        .eq('id', user.id);

    if (!error) {
        setUser(prev => ({ ...prev, membership_tier: tier, membershipTier: tier })); // Update local state
        alert(`Upgraded to ${tier}!`);
    } else {
        alert("Error upgrading: " + error.message);
    }
  };

  const toggleAdPreference = async () => {
      if (!user) return;
      const newVal = !user.adPreferences.allowAds;

      const { error } = await supabase
        .from('profiles')
        .update({ ad_preferences_allow_ads: newVal })
        .eq('id', user.id);

      if (!error) {
          setUser(prev => ({ ...prev, adPreferences: { allowAds: newVal } }));
      }
  };

  const ripenMatch = async () => {
      // Use the Database Function to ensure concurrency safety
      const { data, error } = await supabase.rpc('attempt_ripen');

      if (error) {
          console.error(error);
          return { success: false, reason: 'error' };
      }

      if (data.success) {
           setUser(prev => ({ ...prev, dailyRipenCount: prev.dailyRipenCount + 1 }));
           return { success: true };
      } else {
          return { success: false, reason: data.reason };
      }
  };

  const createAd = async (adData) => {
     const { error } = await supabase
        .from('ads')
        .insert([{
            creator_id: user.id,
            title: adData.title,
            content: adData.content,
            target_audience: adData.target
        }]);

     if (error) {
         alert("Error creating ad: " + error.message);
     } else {
         alert("Ad created!");
         fetchAds();
     }
  };

  if (loading) return <div>Loading Peach Delta...</div>;

  if (!session) {
      return <Auth />;
  }

  // Normalize user object structure for components
  const userForContext = user ? {
      ...user,
      membershipTier: user.membership_tier || user.membershipTier || 'free', // Handle DB vs Local naming
  } : null;

  return (
    <UserContext.Provider value={{
        user: userForContext,
        ads,
        currentView,
        navigateTo,
        upgradeMembership,
        toggleAdPreference,
        ripenMatch,
        createAd
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
