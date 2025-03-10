import supabase from '../utils/supabase.ts';

export const fetchMenu = async () => {
  const { data, error } = await supabase.from('menu_items').select('*');

  if (error) {
    throw Error('Failed getting menu items');
  }

  return data;
};
