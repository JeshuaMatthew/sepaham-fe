import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  STUDENTS_QUERY_KEY,
  downloadStudentCv,
  fetchStudents,
} from "@/features/faculty/services/studentService";
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
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvMimeType, setCvMimeType] = useState("");
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);

  const handleViewCv = (student: FacultyStudent) => {
    setCvStudent(student);
    setCvUrl(null);
    setCvMimeType("");
    setCvError(null);
    setCvLoading(true);
  };

  // Unduh berkas asli setiap kali modal dibuka untuk mahasiswa berbeda.
  // Object URL sebelumnya dicabut supaya tidak bocor memori.
  useEffect(() => {
    if (!cvStudent) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    void downloadStudentCv(cvStudent.id)
      .then(({ blob, mimeType }) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setCvUrl(objectUrl);
        setCvMimeType(mimeType);
      })
      .catch(() => {
        if (!cancelled) setCvError("Gagal memuat CV. Berkas mungkin sudah dihapus dari server.");
      })
      .finally(() => {
        if (!cancelled) setCvLoading(false);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [cvStudent]);

  const handleCloseCv = () => {
    setCvStudent(null);
    setCvUrl(null);
    setCvError(null);
  };

  return (
    <FacultyStudentsContainer
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      cvStudent={cvStudent}
      cvUrl={cvUrl}
      cvMimeType={cvMimeType}
      cvLoading={cvLoading}
      cvError={cvError}
      onViewCv={handleViewCv}
      onCloseCv={handleCloseCv}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default FacultyStudentsPage;
