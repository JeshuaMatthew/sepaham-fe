import AxiosInstance from "@/lib/axios";

/**
 * Call service — meminta LiveKit access token dari backend untuk join sebuah
 * room. Media (mic/video) mengalir lewat server LiveKit, bukan backend ini.
 */

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
