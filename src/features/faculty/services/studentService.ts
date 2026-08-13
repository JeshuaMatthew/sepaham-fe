import AxiosInstance from "@/lib/axios";
import type { FacultyStudent } from "@/features/faculty/types/student";

export const STUDENTS_QUERY_KEY = ["faculty", "students"] as const;

export async function fetchStudents(): Promise<FacultyStudent[]> {
  const { data } = await AxiosInstance.get<{ students: FacultyStudent[] }>("/faculty/students");
  return data.students;
}
