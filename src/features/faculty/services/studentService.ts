import AxiosInstance from "@/lib/axios";
import type { FacultyStudent } from "@/features/faculty/types/student";

export const STUDENTS_QUERY_KEY = ["faculty", "students"] as const;

export async function fetchStudents(): Promise<FacultyStudent[]> {
  const { data } = await AxiosInstance.get<{ students: FacultyStudent[] }>("/faculty/students");
  return data.students;
}

/**
 * Unduh berkas CV asli milik mahasiswa. Mengembalikan Blob + nama berkas
 * (dari header Content-Disposition) supaya UI bisa menampilkan pratinjau dan
 * tombol unduh yang benar-benar berfungsi.
 */
export async function downloadStudentCv(
  studentId: string,
): Promise<{ blob: Blob; fileName: string; mimeType: string }> {
  const { data, headers } = await AxiosInstance.get<Blob>(`/faculty/students/${studentId}/cv`, {
    responseType: "blob",
  });
  const disposition = (headers?.["content-disposition"] as string | undefined) ?? "";
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(disposition);
  const fileName = match?.[1]?.replace(/"/g, "").trim() || "cv";
  const mimeType = (headers?.["content-type"] as string | undefined) ?? data.type ?? "";
  return { blob: data, fileName: decodeURIComponent(fileName), mimeType };
}
