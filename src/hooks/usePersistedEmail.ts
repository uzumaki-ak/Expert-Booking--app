// AsyncStorage-backed email — used by the My Bookings flow so returning users skip the prompt

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "bookr:lastEmail";

export const usePersistedEmail = () => {
  const [email, setEmailState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => setEmailState(v))
      .finally(() => setLoaded(true));
  }, []);

  const setEmail = async (next: string | null) => {
    setEmailState(next);
    if (next) await AsyncStorage.setItem(KEY, next);
    else await AsyncStorage.removeItem(KEY);
  };

  return { email, setEmail, loaded };
};
