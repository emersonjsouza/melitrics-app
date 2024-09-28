import { useMutation } from "@tanstack/react-query";
import { SubscriptionRegister } from "../services/types";
import { createSubscription } from "../services";

export const useSubscriptionMutation = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: SubscriptionRegister) => createSubscription(payload)
  })

  return {
    mutateAsync, isPending, error
  };
};