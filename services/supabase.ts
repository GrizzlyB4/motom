import { createClient } from '@supabase/supabase-js';
import { HeatmapPoint } from '../types';

const supabaseUrl = 'https://wlfhvwuftwxlhnaphqgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZmh2d3VmdHd4bGhuYXBocWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mjg0MTUsImV4cCI6MjA3NjMwNDQxNX0.BNMaz6bVeYm72Hjn03rjbHUTAegSsFVAPcVuo9IgTME';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
