import { useMutation } from "@tanstack/react-query";
import { TaxRegister } from "../services/types";
import { deleteUser } from "../services";

export const useDeleteUserMutation = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (userID: string) => deleteUser(userID)
  })

  return {
    mutateAsync, isPending, error
  };
};