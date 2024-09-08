import { useMutation } from "@tanstack/react-query";
import { TaxRegister } from "../services/types";
import { createTax } from "../services";

export const useTaxMutation = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: TaxRegister) => createTax(payload)
  })

  return {
    mutateAsync, isPending, error
  };
};