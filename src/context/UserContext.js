import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { supabase } from '../supabaseClient';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [pits, setPits] = useState(25);
  const [rippedMatches, setRippedMatches] = useState([]);
  const [dailyRipens, setDailyRipens] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState({
    id: null,
    alias: "My_Alias",
    email: "user@example.com",
    level: "Year 2",
    membershipType: 'free',
    basics: { fun: [], media: [] },
    life: { based: "", upbringing: "" },
    work: { job: "", reason: "" },
    relationships: { values: [], lookingFor: "" },
    vision: "",
    special: ""
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        // Check if we need to reset daily ripens
        const lastReset = new Date(data.last_ripen_reset);
        const now = new Date();
        const isSameDay = lastReset.getDate() === now.getDate() &&
                          lastReset.getMonth() === now.getMonth() &&
                          lastReset.getFullYear() === now.getFullYear();

        let currentDailyRipens = data.daily_ripens_count;
        if (!isSameDay) {
          currentDailyRipens = 0;
          await supabase.from('profiles').update({
            daily_ripens_count: 0,
            last_ripen_reset: now.toISOString()
          }).eq('id', user.id);
        }

        setUserProfile({
          ...data,
          membershipType: data.membership_type,
          basics: data.basics || { fun: [], media: [] },
          life: data.life || { based: "", upbringing: "" },
          work: data.work || { job: "", reason: "" },
          relationships: data.relationships || { values: [], lookingFor: "" }
        });
        setPits(data.pits);
        setDailyRipens(currentDailyRipens);

        // Fetch ripens
        const { data: ripens } = await supabase
          .from('ripens')
          .select('ripened_profile_id')
          .eq('ripened_by', user.id);

        if (ripens) {
          setRippedMatches(ripens.map(r => r.ripened_profile_id));
        }
      }
    }
    setLoading(false);
  };

  const updateMembership = async (type) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ membership_type: type })
        .eq('id', user.id);

      if (!error) {
        setUserProfile(prev => ({ ...prev, membershipType: type }));
      }
    } else {
        // Fallback for mock/demo
        setUserProfile(prev => ({ ...prev, membershipType: type }));
    }
  };

  const addPits = async (amount) => {
    const { data: { user } } = await supabase.auth.getUser();
    const newPits = pits + amount;
    if (user) {
      await supabase.from('profiles').update({ pits: newPits }).eq('id', user.id);
    }
    setPits(newPits);
  };

  const ripenMatch = async (matchId) => {
    if (rippedMatches.includes(matchId)) return true;

    const isPremium = userProfile.membershipType === 'premium';
    const limit = isPremium ? 999 : 25;
    const { data: { user } } = await supabase.auth.getUser();

    if (dailyRipens < limit) {
      if (user) {
        await supabase.from('ripens').insert({
          ripened_by: user.id,
          ripened_profile_id: matchId
        });
        await supabase.from('profiles')
          .update({ daily_ripens_count: dailyRipens + 1 })
          .eq('id', user.id);
      }
      setRippedMatches(prev => [...prev, matchId]);
      setDailyRipens(prev => prev + 1);
      return true;
    } else {
      // Logic for using pits if over limit
      if (pits >= 5) {
        const newPits = pits - 5;
        if (user) {
           await supabase.from('ripens').insert({
             ripened_by: user.id,
             ripened_profile_id: matchId
           });
           await supabase.from('profiles').update({ pits: newPits }).eq('id', user.id);
        }
        setRippedMatches(prev => [...prev, matchId]);
        setPits(newPits);
        return true;
      }
    }
    return false;
  };

  const isRipped = (matchId) => rippedMatches.includes(matchId);

  return (
    <UserContext.Provider value={{
      pits,
      addPits,
      ripenMatch,
      isRipped,
      userProfile,
      updateMembership,
      dailyRipens,
      rippedMatches,
      loading,
      potentialMatches: MOCK_USERS,
      likes: [MOCK_USERS[1], MOCK_USERS[3]] // Mocked likes for demonstration
    }}>
      {children}
    </UserContext.Provider>
  );
};
