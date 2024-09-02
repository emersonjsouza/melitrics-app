import { useMutation } from "@tanstack/react-query";
import { UserRegister } from "../services/types";
import { signUp } from "../services";

export const useSignUp = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: UserRegister) => signUp(payload)
  })

  return {
    mutateAsync, isPending, error
  };
};