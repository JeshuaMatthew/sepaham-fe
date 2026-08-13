import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { STUDENTS_QUERY_KEY, fetchStudents } from "@/features/faculty/services/studentService";
import { buildCareerProfile } from "@/features/career/services/careerService";
import type { FacultyStudent } from "@/features/faculty/types/student";
import FacultyStudentsContainer from "../components/FacultyStudentsContainer";

/**
 * FacultyStudentsPage — dashboard dosen untuk melihat perkembangan tiap
 * mahasiswa & CV-nya. Page mengambil data + menghitung kesiapan; container
 * hanya render. TIDAK ADA class Tailwind di sini.
 */

function FacultyStudentsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: fetchStudents,
  });

  const rows = useMemo(
    () =>
      (data ?? []).map((student) => {
        const profile = buildCareerProfile({
          roadmap: {
            completed: student.roadmap.completed,
            total: student.roadmap.total,
            title: student.roadmap.title,
          },
          github: student.github,
          projects: student.projects,
          cv: { provided: student.cvFileName != null, fileName: student.cvFileName },
        });
        return { student, readiness: profile.readiness, level: profile.level };
      }),
    [data],
  );

  const [cvStudent, setCvStudent] = useState<FacultyStudent | null>(null);

  return (
    <FacultyStudentsContainer
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      cvStudent={cvStudent}
      onViewCv={setCvStudent}
      onCloseCv={() => setCvStudent(null)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyStudentsPage;
