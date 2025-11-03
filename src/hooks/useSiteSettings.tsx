import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface SiteSettings {
  site_name: string;
  site_logo: string;
  site_banner_1: string;
  site_banner_2: string;
  site_banner_3: string;
  hero_title: string;
  hero_description: string;
  featured_title: string;
  featured_description: string;
  delivery_time: string;
}

export function useSiteSettings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['site-settings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('key, value');
      
      if (error) throw error;
      
      const settings: any = {};
      data?.forEach((setting: any) => {
        settings[setting.key] = setting.value || '';
      });
      
      return settings as SiteSettings;
    },
  });
}
