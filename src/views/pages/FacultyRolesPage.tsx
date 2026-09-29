import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "@/lib/axios";
import { GradIcon, PlusIcon, EditIcon, TrashIcon } from "@/shared/icons";

interface Role {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  accent: string;
}

const ROLES_QUERY_KEY = ["faculty", "roles"] as const;

async function fetchRoles(): Promise<Role[]> {
  const { data } = await AxiosInstance.get<Role[]>("/faculty/roles");
  return data;
}

async function createRole(role: Omit<Role, "id">): Promise<Role> {
  const { data } = await AxiosInstance.post<Role>("/faculty/roles", role);
  return data;
}

async function updateRole(id: string, role: Omit<Role, "id">): Promise<Role> {
  const { data } = await AxiosInstance.put<Role>(`/faculty/roles/${id}`, role);
  return data;
}

async function deleteRole(id: string): Promise<void> {
  await AxiosInstance.delete(`/faculty/roles/${id}`);
}

const EMPTY_FORM = { title: "", emoji: "", tagline: "", description: "", accent: "" };

export default function FacultyRolesPage() {
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: fetchRoles,
  });

  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  // Form harus punya flag sendiri. Sebelumnya form dirender hanya kalau
  // `editing || form.title` — padahal `openCreate()` menyetel title ke string
  // kosong, sehingga tombol "Tambah Role" tidak pernah membuka apa pun.
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      setForm(EMPTY_FORM);
      setFormOpen(false);
      setNotice("Role berhasil ditambahkan.");
    },
    onError: () => setNotice("Gagal menambahkan role."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Omit<Role, "id"> }) => updateRole(id, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      setEditing(null);
      setForm(EMPTY_FORM);
      setFormOpen(false);
      setNotice("Role berhasil diperbarui.");
    },
    onError: () => setNotice("Gagal memperbarui role."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      setNotice("Role berhasil dihapus.");
    },
    onError: () => setNotice("Gagal menghapus role."),
  });

  const openEdit = (role: Role) => {
    setEditing(role);
    setFormOpen(true);
    setForm({
      title: role.title,
      emoji: role.emoji,
      tagline: role.tagline,
      description: role.description,
      accent: role.accent,
    });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, role: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Manajemen Role</h1>
            <p className="text-sm text-muted">
              Tambah, edit, atau hapus role yang tersedia untuk mahasiswa.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-canvas transition-transform hover:scale-105"
          >
            <PlusIcon className="h-4 w-4" /> Tambah Role
          </button>
        </header>

        {notice && (
          <div className="mb-4 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink">
            {notice}
          </div>
        )}

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6"
          >
            <h2 className="font-display text-lg font-semibold text-ink">
              {editing ? "Edit Role" : "Role Baru"}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                  placeholder="Frontend Engineer"
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Emoji</span>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                  placeholder="Simbol role (opsional)"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Tagline</span>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                  placeholder="Build interactive web interfaces"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Accent Color</span>
                <input
                  type="text"
                  value={form.accent}
                  onChange={(e) => setForm({ ...form, accent: e.target.value })}
                  className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                  placeholder="#38bdf8"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="resize-none rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                placeholder="Deskripsi singkat tentang role ini"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-canvas transition-transform hover:scale-105 disabled:opacity-50"
              >
                {editing ? "Simpan Perubahan" : "Tambah Role"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="cursor-pointer rounded-full border border-line px-5 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted">Memuat…</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {role.emoji || <GradIcon className="h-6 w-6" />}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted">{role.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(role)}
                      className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-elevate hover:text-ink"
                      aria-label={`Edit ${role.title}`}
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(role.id)}
                      className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      aria-label={`Hapus ${role.title}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {role.tagline && (
                  <p className="text-sm text-muted">{role.tagline}</p>
                )}
                {role.description && (
                  <p className="text-xs text-muted">{role.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
