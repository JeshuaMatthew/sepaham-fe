import AxiosInstance from "@/lib/axios";
import type { InternshipContact } from "@/features/career/types/internship";

/**
 * Service kontak magang (backend Axum: GET /api/internships/contacts).
 * Daftar kontak terbuka saat progres roadmap mencapai INTERNSHIP_UNLOCK_PERCENT.
 */

export const INTERNSHIP_CONTACTS_QUERY_KEY = ["internship", "contacts"] as const;

/** Persentase penyelesaian roadmap yang membuka kontak magang. */
export const INTERNSHIP_UNLOCK_PERCENT = 50;

export async function fetchInternshipContacts(): Promise<InternshipContact[]> {
  const { data } = await AxiosInstance.get<{ contacts: InternshipContact[] }>(
    "/internships/contacts",
  );
  return data.contacts;
}
