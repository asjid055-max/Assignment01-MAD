import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn]);

  return null;
}
