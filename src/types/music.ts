/** Tipe data pemutar musik (dipakai host saat panggilan). */

export interface LofiTrack {
  id: string;
  title: string;
  artist: string;
}

/**
 * Satu lagu di playlist panggilan — berasal dari file yang diunggah host.
 * `url` adalah object URL (blob:) dari file tersebut.
 */
export interface PlaylistTrack {
  id: string;
  title: string;
  url: string;
}
