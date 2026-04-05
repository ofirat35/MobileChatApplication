import { PreferenceListModel } from "../models/Users/PreferenceListModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { QueryKeys } from "../helpers/consts/QueryKeys";

export function usePreference() {
  const queryClient = useQueryClient();

  const { data: preference, isLoading } = useQuery({
    queryKey: QueryKeys.preference.base,
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
      queryClient.setQueryData(QueryKeys.preference.base, updatedPreference);
      queryClient.invalidateQueries({
        queryKey: QueryKeys.discovery.base,
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
