import AxiosInstance from "@/lib/axios";
import type {
  Roadmap,
  RoadmapSummary,
  SubmissionPayload,
  SubmissionState,
} from "@/features/roadmap/types/roadmap";

export const ROADMAP_CATALOG_QUERY_KEY = ["roadmap", "catalog"] as const;
export const roadmapTreeQueryKey = (id: string) => ["roadmap", "tree", id] as const;

export async function fetchRoadmapCatalog(): Promise<RoadmapSummary[]> {
  // Langsung dari server, tanpa override localStorage. Sebelumnya hasil edit
  // dosen disimpan di localStorage dan selalu menang atas server, sehingga
  // server tidak pernah dibaca lagi dan edit tidak pernah tersinkron.
  const { data } = await AxiosInstance.get<{ roadmaps: RoadmapSummary[] }>("/roadmaps");
  return data.roadmaps;
}

/**
 * Roadmap lengkap untuk editor dosen, menyertakan kunci jawaban.
 *
 * Endpoint mahasiswa membuang `correctIndex`, jadi halaman node mahasiswa
 * tidak boleh memakai ini. Hanya boleh dipanggil dengan akun faculty.
 */
export async function fetchFacultyRoadmapTree(id: string): Promise<Roadmap> {
  const { data } = await AxiosInstance.get<Roadmap>(`/faculty/roadmaps/${id}`);
  return data;
}

/**
 * Simpan perubahan katalog (judul, role, warna, dll) ke server.
 * Error dilempar ke pemanggil supaya UI bisa menampilkan pesan gagal —
 * sebelumnya error ditelan `.catch(() => {})` dan UI bilang "Tersimpan".
 */
export async function saveRoadmapCatalog(roadmaps: RoadmapSummary[]): Promise<void> {
  await Promise.all(
    roadmaps.map((roadmap) =>
      AxiosInstance.put(`/roadmaps/${roadmap.id}`, {
        roleId: roadmap.roleId,
        title: roadmap.title,
        emoji: roadmap.emoji,
        color: roadmap.color,
        description: roadmap.description,
        difficulty: roadmap.difficulty,
        matchTags: roadmap.matchTags,
        author: roadmap.author,
      }),
    ),
  );
}

/** Buat roadmap baru. Id dibuat server, bukan `custom-xxx` dari browser. */
export async function createRoadmap(input: {
  roleId: string;
  title: string;
  author: string;
}): Promise<{ id: string }> {
  const { data } = await AxiosInstance.post<{ id: string }>("/roadmaps", {
    roleId: input.roleId,
    title: input.title,
    author: input.author,
    nodes: [],
    edges: [],
  });
  return data;
}

/** Hapus roadmap di server. Sebelumnya endpoint ini tidak ada. */
export async function deleteRoadmap(id: string): Promise<void> {
  await AxiosInstance.delete(`/roadmaps/${id}`);
}

export async function fetchRoadmapTree(id: string): Promise<Roadmap> {
  // Langsung dari server. Sebelumnya ada fallback yang mengembalikan roadmap
  // kosong `{ title: id, nodes: [] }` saat request gagal, sehingga halaman
  // rusak terlihat seperti roadmap yang sah tapi kosong.
  const { data } = await AxiosInstance.get<Roadmap>(`/roadmaps/${id}`);
  return data;
}

/** Simpan tree roadmap ke server. Error dilempar ke pemanggil. */
export async function saveRoadmapTree(id: string, tree: Roadmap): Promise<void> {
  await AxiosInstance.put(`/roadmaps/${id}`, tree);
}

export async function fetchSubmissions(
  roadmapId: string,
): Promise<Record<string, SubmissionState>> {
  const { data } = await AxiosInstance.get<Record<string, SubmissionState>>(
    `/roadmaps/${roadmapId}/submissions`,
  );
  return data;
}

/**
 * Kirim bukti submission ke server; server yang menilai.
 *
 * Yang dikirim hanya `SubmissionPayload` — bukan `SubmissionState`. Backend
 * menolak `score` dan `done` dengan 400 kalau keduanya ikut terkirim, jadi
 * jangan pernah menyalin state ke sini. Nilai yang dikembalikan adalah
 * penilaian server, termasuk apakah node selesai.
 */
export async function pushSubmission(
  roadmapId: string,
  nodeKey: string,
  payload: SubmissionPayload,
): Promise<SubmissionState> {
  const { data } = await AxiosInstance.put<SubmissionState>(
    `/roadmaps/${roadmapId}/nodes/${nodeKey}/submission`,
    payload,
  );
  return data;
}

/** Unggah berkas bukti node bertipe `file`. */
export async function uploadSubmissionFile(
  roadmapId: string,
  nodeKey: string,
  file: File,
): Promise<{ fileName: string; url: string; size: number }> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await AxiosInstance.post<{ fileName: string; url: string; size: number }>(
    `/roadmaps/${roadmapId}/nodes/${nodeKey}/submission/file`,
    form,
  );
  return data;
}

export async function pushActivity(roadmapId: string): Promise<void> {
  await AxiosInstance.post(`/roadmaps/${roadmapId}/activity`);
}

export async function fetchRoadmapActivity(): Promise<Record<string, number>> {
  try {
    const { data } = await AxiosInstance.get<Record<string, number>>("/roadmap-activity");
    return data;
  } catch {
    return {};
  }
}
