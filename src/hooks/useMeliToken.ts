import { useMutation } from "@tanstack/react-query";
import { getMeliToken } from "../services";

export const useMeliToken = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: { code: string, callbackUrl: string }) => getMeliToken(payload.code, payload.callbackUrl)
  })

  return {
    mutateAsync, isPending, error
  };
};