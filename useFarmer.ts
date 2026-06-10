import { trpc } from '@/lib/trpc';

export function useFarmerProfile() {
  const { data: profile, isLoading, error } = trpc.farmer.getProfile.useQuery();
  const updateMutation = trpc.farmer.updateProfile.useMutation();

  const updateProfile = async (data: Parameters<typeof updateMutation.mutateAsync>[0]) => {
    return await updateMutation.mutateAsync(data);
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdating: updateMutation.isPending,
  };
}

export function useChatMessages() {
  const utils = trpc.useUtils();
  const { data: history, isLoading } = trpc.chat.getHistory.useQuery({ limit: 50 });
  const sendMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getHistory.invalidate();
    },
  });

  const sendMessage = async (userMessage: string, language: 'en' | 'hi' | 'gu') => {
    return await sendMutation.mutateAsync({ userMessage, language });
  };

  return {
    history,
    isLoading,
    sendMessage,
    isSending: sendMutation.isPending,
    error: sendMutation.error,
  };
}

export function useAlerts() {
  const utils = trpc.useUtils();
  const { data: alerts, isLoading } = trpc.alerts.getAlerts.useQuery({ unreadOnly: false });
  const markAsReadMutation = trpc.alerts.markAsRead.useMutation({
    onSuccess: () => {
      utils.alerts.getAlerts.invalidate();
    },
  });

  const markAsRead = async (alertId: number) => {
    return await markAsReadMutation.mutateAsync({ alertId });
  };

  return {
    alerts,
    isLoading,
    markAsRead,
    isMarking: markAsReadMutation.isPending,
  };
}

export function useRecommendedCrops() {
  const utils = trpc.useUtils();
  const { data: crops, isLoading } = trpc.crops.getRecommended.useQuery();
  const addMutation = trpc.crops.addRecommendation.useMutation({
    onSuccess: () => {
      utils.crops.getRecommended.invalidate();
    },
  });

  const addCrop = async (data: Parameters<typeof addMutation.mutateAsync>[0]) => {
    return await addMutation.mutateAsync(data);
  };

  return {
    crops,
    isLoading,
    addCrop,
    isAdding: addMutation.isPending,
  };
}
