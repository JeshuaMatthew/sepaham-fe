import AxiosInstance from "@/lib/axios";

export interface CallToken {
  token: string;
  url: string;
  identity: string;
  name: string;
  room: string;
}

export async function fetchCallToken(room: string): Promise<CallToken> {
  const { data } = await AxiosInstance.post<CallToken>("/calls/token", { room });
  return data;
}
