/**
 * Data mahasiswa untuk dashboard dosen: progres karier + info CV.
 */

export interface StudentRoadmap {
  title: string;
  completed: number;
  total: number;
}

export interface StudentGithub {
  repos: number;
  commits: number;
  topLanguages: string[];
}

export interface FacultyStudent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  /** nama file CV yang diupload mahasiswa (opsional). */
  cvFileName?: string;
  cvUploadedAt?: string;
  roadmap: StudentRoadmap;
  github: StudentGithub;
  /** jumlah project/tim yang diikuti. */
  projects: number;
}
