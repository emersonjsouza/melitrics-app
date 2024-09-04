import { useMutation } from "@tanstack/react-query";
import { ChannelRegister } from "../services/types";
import { createChannel } from "../services";

export const useChannel = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: ChannelRegister) => createChannel(payload)
  })

  return {
    mutateAsync, isPending, error
  };
};