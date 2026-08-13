/**
 * Kontak perusahaan untuk magang — terbuka saat progres roadmap mencapai ambang tertentu.
 */

export interface InternshipContact {
  id: string;
  company: string;
  emoji: string;
  position: string;
  roleId: string;
  location: string;
  type: string;
  pic: string;
  contact: string;
  note?: string;
}
