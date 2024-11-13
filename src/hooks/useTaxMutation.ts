import { useMutation } from "@tanstack/react-query";
import { TaxRegister } from "../services/types";
import { createTax } from "../services";
import { useQueryClient } from "@tanstack/react-query";

export const useTaxMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: TaxRegister) => createTax(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['ad']
      })
    }
  })

  return {
    mutateAsync, isPending, error
  };
};