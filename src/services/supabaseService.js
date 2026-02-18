
import { supabase } from '../supabaseClient';

export const supabaseService = {
  // --- AUTH ---
  auth: {
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
    getUser: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  },

  // --- PROFILES ---
  profiles: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },
    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();
      return { data, error };
    },
    getPotentialMatches: async (userId, filters = {}) => {
      // Get IDs already swiped
      const { data: swipes } = await supabase
        .from('swipes')
        .select('swipee_id')
        .eq('swiper_id', userId);

      const swipedIds = swipes ? swipes.map(s => s.swipee_id) : [];
      swipedIds.push(userId); // Exclude self

      // Query profiles
      // Note: "Not In" filter with large lists can be inefficient, but fine for MVP
      let query = supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${swipedIds.join(',')})`);

      // Apply filters (e.g. location)
      if (filters.location) {
          query = query.eq('location', filters.location);
      }

      const { data, error } = await query;
      return { data, error };
    }
  },

  // --- MATCHES & SWIPES ---
  matches: {
    swipe: async (swiperId, swipeeId, direction) => {
      // Insert swipe
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({ swiper_id: swiperId, swipee_id: swipeeId, direction });

      if (swipeError) return { error: swipeError };

      // Check for match (if direction is right and other person swiped right)
      if (direction === 'right') {
        const { data: otherSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', swipeeId)
          .eq('swipee_id', swiperId)
          .eq('direction', 'right')
          .single();

        if (otherSwipe) {
          // Create Match
          const { data: match, error: matchError } = await supabase
            .from('matches')
            .insert({ user1_id: swiperId, user2_id: swipeeId }) // Assuming schema handles ID ordering or check logic
            .select()
            .single();

          return { match, isMatch: true, error: matchError };
        }
      }

      return { isMatch: false };
    },

    getMatches: async (userId) => {
      // Matches where user is 1 or 2
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!user1_id(*),
          user2:profiles!user2_id(*)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      return { data, error };
    },

    ripen: async (matchId, userId) => {
      // Check subscription limits in context before calling this?
      // Or handle logic here?
      // Assuming context handles payment/limit check, this just updates DB.
      const { data, error } = await supabase
        .from('matches')
        .update({ is_ripened: true, ripened_by: userId })
        .eq('id', matchId)
        .select();
      return { data, error };
    }
  },

  // --- MESSAGES ---
  messages: {
    get: async (matchId) => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });
      return { data, error };
    },
    send: async (matchId, senderId, content) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({ match_id: matchId, sender_id: senderId, content })
        .select();
      return { data, error };
    },
    subscribe: (matchId, callback) => {
      return supabase
        .channel(`public:messages:match_id=eq.${matchId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, payload => {
          callback(payload.new);
        })
        .subscribe();
    }
  },

  // --- ADS ---
  ads: {
    post: async (adData) => {
      const { data, error } = await supabase
        .from('ads')
        .insert(adData)
        .select();
      return { data, error };
    },
    getAll: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('active', true);
      return { data, error };
    }
  },

  // --- FEEDBACK ---
  feedback: {
    submit: async (userId, type, content) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert({ user_id: userId, type, content });
      return { data, error };
    }
  }
};
