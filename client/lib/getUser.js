import { supabase } from './supabase';
import { Alert } from 'react-native';

export async function getUser() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert('Error', userError?.message || 'Unable to get user info.')
      return
    }
    return user.id
}