import AxiosInstance from "@/lib/axios";
import type { FacultyStudent } from "@/features/faculty/types/student";

/**
 * Daftar mahasiswa untuk dashboard dosen (backend Axum: GET /api/faculty/students).
 * Diagregasi dari data nyata: profil, preferensi/roadmap, github, projects.
 */

export const STUDENTS_QUERY_KEY = ["faculty", "students"] as const;

export async function fetchStudents(): Promise<FacultyStudent[]> {
  const { data } = await AxiosInstance.get<{ students: FacultyStudent[] }>(
    "/faculty/students",
  );
  return data.students;
}
