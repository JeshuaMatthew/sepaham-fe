import type { DiscoverServer } from "@/features/chat/services/communityService";
import { CheckIcon, CloseIcon } from "@/shared/icons";

interface ServerDiscoverPanelProps {
  servers: DiscoverServer[];
  joiningId: string | null;
  isLoading: boolean;
  onJoin: (serverId: string) => void;
  onClose: () => void;
}

/**
 * Panel "Temukan komunitas" — daftar server yang bisa diikuti user.
 * Muncul dari tombol "+" di ServerRail, dan otomatis terbuka saat user belum
 * punya satu pun server (kalau tidak, chat-nya kosong tanpa jalan keluar).
 */
function ServerDiscoverPanel({
  servers,
  joiningId,
  isLoading,
  onJoin,
  onClose,
}: ServerDiscoverPanelProps) {
  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r border-line bg-surface">
      <header className="flex items-center gap-2 border-b border-line px-4 py-3.5">
        <div className="flex min-w-0 flex-col">
          <span className="font-display text-sm font-semibold text-ink">
            Temukan komunitas
          </span>
          <span className="text-xs text-muted">Server kampus yang bisa kamu ikuti</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup daftar komunitas"
          className="ml-auto cursor-pointer text-muted hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-shimmer rounded-xl bg-elevate" />
            ))}
          </div>
        ) : servers.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-muted">
            Belum ada server yang bisa diikuti.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {servers.map((item) => (
              <li
                key={item.server.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: item.server.color || "#64748b" }}
                >
                  {item.server.initial}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-ink">
                    {item.server.name}
                  </span>
                  <span className="truncate text-[11px] text-muted">
                    {item.memberCount} anggota · {item.channels.length} channel
                  </span>
                </div>
                {item.joined ? (
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary">
                    <CheckIcon className="h-3.5 w-3.5" />
                    Joined
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onJoin(item.server.id)}
                    disabled={joiningId != null}
                    className="shrink-0 cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {joiningId === item.server.id ? "Joining…" : "Join"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ServerDiscoverPanel;
