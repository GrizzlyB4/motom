import { createClient } from '@supabase/supabase-js';
import { HeatmapPoint } from '../types';

const supabaseUrl = 'https://wlfhvwuftwxlhnaphqgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZmh2d3VmdHd4bGhuYXBocWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjg0MTUsImV4cCI6MjA3NjMwNDQxNX0.BNMaz6bVeYm72Hjn03rjbHUTAegSsFVAPcVuo9IgTME';

// Create client with enhanced configuration to handle schema properly
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'motomarket-app'
    }
  }
});

export const getHeatmapData = async (): Promise<HeatmapPoint[]> => {
    const { data, error } = await supabase
        .from('heatmap_points')
        .select('x, y, value');
    
    if (error) {
        console.error('Error fetching heatmap data:', error);
        return [];
    }
    return data;
};

export const addHeatmapPoint = async (point: Omit<HeatmapPoint, 'id'>) => {
    const { error } = await supabase.from('heatmap_points').insert([point]);
    if (error) {
        console.error('Error adding heatmap point:', error);
    }
};

// Function to refresh the Supabase schema cache with a more comprehensive approach
export const refreshSchema = async (): Promise<boolean> => {
    try {
        // Force refresh by querying system catalog tables
        const { error: catalogError } = await supabase
            .from('parts')
            .select('id')
            .limit(1);
        
        // If we still get an error, try querying the information schema directly
        if (catalogError) {
            console.warn('Initial schema refresh failed, trying direct catalog query...');
            
            // Query information schema to force schema refresh
            const { data: infoData, error: infoError } = await supabase.rpc('version');
            
            if (infoError) {
                console.error('Schema refresh failed:', infoError);
                return false;
            }
            
            console.log('Schema refresh completed via RPC');
            return true;
        }
        
        console.log('Schema refresh completed via table query');
        return true;
    } catch (error) {
        console.error('Exception while refreshing schema:', error);
        return false;
    }
};

// Enhanced insert function with retry logic for schema issues
export const insertPartWithRetry = async (partData: any, maxRetries = 3): Promise<any> => {
    let lastError: any = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Try to insert the part without explicitly specifying columns
            const { data, error } = await supabase
                .from('parts')
                .insert(partData)
                .select();
            
            if (error) {
                lastError = error;
                
                // If it's a schema cache error, refresh schema and retry
                if (error.message.includes('schema cache') && attempt < maxRetries - 1) {
                    console.log(`Schema cache error detected, refreshing schema (attempt ${attempt + 1})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
                    await refreshSchema();
                    continue; // Retry the insert
                }
                
                // If it's not a schema error or we've exhausted retries, throw the error
                throw error;
            }
            
            // If successful, return the first item from the data array
            return { data: data?.[0] || null, error: null };
        } catch (error) {
            lastError = error;
            
            // If it's a schema cache error and we have retries left, refresh and retry
            if (error.message.includes('schema cache') && attempt < maxRetries - 1) {
                console.log(`Schema cache error detected, refreshing schema (attempt ${attempt + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
                await refreshSchema();
                continue; // Retry the insert
            }
            
            // If we've exhausted retries or it's not a schema error, break
            break;
        }
    }
    
    // If we get here, we've exhausted retries
    return { data: null, error: lastError };
};

// Enhanced insert function for motorcycles with retry logic
export const insertMotorcycleWithRetry = async (motoData: any, maxRetries = 3): Promise<any> => {
    let lastError: any = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Try to insert the motorcycle without explicitly specifying columns
            const { data, error } = await supabase
                .from('motorcycles')
                .insert(motoData)
                .select();
            
            if (error) {
                lastError = error;
                
                // If it's a schema cache error, refresh schema and retry
                if (error.message.includes('schema cache') && attempt < maxRetries - 1) {
                    console.log(`Schema cache error detected, refreshing schema (attempt ${attempt + 1})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
                    await refreshSchema();
                    continue; // Retry the insert
                }
                
                // If it's not a schema error or we've exhausted retries, throw the error
                throw error;
            }
            
            // If successful, return the first item from the data array
            return { data: data?.[0] || null, error: null };
        } catch (error) {
            lastError = error;
            
            // If it's a schema cache error and we have retries left, refresh and retry
            if (error.message.includes('schema cache') && attempt < maxRetries - 1) {
                console.log(`Schema cache error detected, refreshing schema (attempt ${attempt + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
                await refreshSchema();
                continue; // Retry the insert
            }
            
            // If we've exhausted retries or it's not a schema error, break
            break;
        }
    }
    
    // If we get here, we've exhausted retries
    return { data: null, error: lastError };
};