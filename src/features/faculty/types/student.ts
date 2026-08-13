/**
 * Data mahasiswa untuk dashboard dosen.
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
  cvFileName?: string;
  cvUploadedAt?: string;
  roadmap: StudentRoadmap;
  github: StudentGithub;
  projects: number;
}
