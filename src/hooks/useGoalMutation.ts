import { useMutation } from "@tanstack/react-query";
import { Goal, TaxRegister } from "../services/types";
import { createGoal } from "../services";

export const useGoalMutation = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: { tax: Goal, organization_id: string }) => createGoal({ ...payload.tax, organization_id: payload.organization_id })
  })

  return {
    mutateAsync, isPending, error
  };
};