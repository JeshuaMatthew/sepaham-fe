/**
 * Kontak perusahaan untuk magang — terbuka saat progres roadmap mencapai
 * ambang tertentu.
 */

export interface InternshipContact {
  id: string;
  company: string;
  emoji: string;
  position: string;
  /** roleId roadmap terkait (mis. "frontend-engineer"). */
  roleId: string;
  location: string;
  type: string;
  /** narahubung / PIC. */
  pic: string;
  /** email atau URL yang bisa dihubungi. */
  contact: string;
  note?: string;
}
