import axios from "axios";
import type { InternshipContact } from "../types/internship";

/**
 * Service kontak magang. Daftar kontak terbuka saat progres roadmap
 * mencapai ambang INTERNSHIP_UNLOCK_PERCENT.
 */

export const INTERNSHIP_CONTACTS_QUERY_KEY = ["internship", "contacts"] as const;

/** Persentase penyelesaian roadmap yang membuka kontak magang. */
export const INTERNSHIP_UNLOCK_PERCENT = 50;

export async function fetchInternshipContacts(): Promise<InternshipContact[]> {
  const { data } = await axios.get<{ contacts: InternshipContact[] }>(
    "/mocks/internshipContacts.json",
  );
  return data.contacts;
}
