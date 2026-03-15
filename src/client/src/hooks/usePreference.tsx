import { PreferenceListModel } from "../models/Users/PreferenceListModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/UserService";

export function usePreference() {
  const queryClient = useQueryClient();

  const { data: preference, isLoading } = useQuery({
    queryKey: ["preference"],
    queryFn: async () => {
      let preference = await UserService.getPreferences();
      if (!preference) {
        preference = {
          id: null,
          minAge: null,
          maxAge: null,
          country: null,
          gender: null,
        };
      }
      return preference;
    },
    staleTime: 1000 * 60,
  });

  const updatePreferenceMutation = useMutation({
    mutationFn: (updatedPreference: PreferenceListModel) =>
      UserService.setPreferences(updatedPreference),
    onSuccess: (data, updatedPreference) => {
      queryClient.setQueryData(["preference"], updatedPreference);
      queryClient.invalidateQueries({
        queryKey: ["discovery-users"],
        exact: true,
      });
    },
  });

  return {
    preference,
    updatePreference: async (preference: PreferenceListModel) =>
      await updatePreferenceMutation.mutateAsync(preference),
    isLoading,
  };
}
