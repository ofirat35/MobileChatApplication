import { useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { keycloakService } from "../helpers/Auth/keycloak";
import { AppUserListModel } from "../models/Users/AppUserListModel";

export function useProfile() {
  const [user, setUser] = useState<AppUserListModel>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    const authenticated = await keycloakService.isAuthenticated();

    if (authenticated) {
      const id = await keycloakService.getCurrentUserId();
      const userData = await UserService.getUserById(id!);
      setUser(userData);
    }

    setLoading(false);
  };

  const updateUser = async () => {
    if (!user) return;

    setLoading(true);
    const result = await UserService.updateUser(user);
    setSuccess(!!result);
    setLoading(false);

    return !!result;
  };

  const setBirthDate = (date: Date) => {
    if (!user) return;

    setUser({
      ...user,
      birthDate: date.toISOString().split("T")[0],
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    setUser,
    loading,
    success,
    setSuccess,
    updateUser,
    setBirthDate,
  };
}
