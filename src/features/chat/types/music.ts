/** Tipe data pemutar musik (dipakai host saat panggilan). */

export interface LofiTrack {
  id: string;
  title: string;
  artist: string;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  url: string;
}
