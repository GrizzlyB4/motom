import { createClient } from '@supabase/supabase-js';
import { HeatmapPoint } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for the entire application
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
});

// Function to add a heatmap point to the database
export const addHeatmapPoint = async (point: HeatmapPoint) => {
  const { data, error } = await supabase
    .from('heatmap_points')
    .insert({
      x: point.x,
      y: point.y,
      value: point.value,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding heatmap point:', error);
    return null;
  }

  return data;
};

// Function to get all heatmap data from the database
export const getHeatmapData = async () => {
  const { data, error } = await supabase
    .from('heatmap_points')
    .select('*');

  if (error) {
    console.error('Error fetching heatmap data:', error);
    return [];
  }

  // Map the database response to the HeatmapPoint interface
  return data.map((point: any) => ({
    x: point.x,
    y: point.y,
    value: point.value,
  }));
};

// Function to get a user profile by ID
export const getProfileById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
};

// Function to get a user profile by email
export const getProfileByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) {
      console.error('Error fetching profile by email:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile by email:', error);
    return null;
  }
};

// Function to archive a conversation
export const archiveConversation = async (conversationId: string, archived: boolean) => {
  try {
    const updateData: any = { archived };
    if (archived) {
      updateData.archived_at = new Date().toISOString();
    } else {
      updateData.archived_at = null;
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating conversation archive status:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error updating conversation archive status:', error);
    return null;
  }
};

// Function to delete archived conversations older than 15 days
export const deleteOldArchivedConversations = async () => {
  try {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    const { data, error } = await supabase
      .from('conversations')
      .delete()
      .lt('archived_at', fifteenDaysAgo.toISOString())
      .eq('archived', true);
      
    if (error) {
      console.error('Error deleting old archived conversations:', error);
      return null;
    }
    
    console.log(`Deleted ${(data as any[])?.length || 0} archived conversations older than 15 days`);
    return data;
  } catch (error) {
    console.error('Unexpected error deleting old archived conversations:', error);
    return null;
  }
};
