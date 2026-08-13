import type { Server } from "@/features/chat/types/chat";

interface ServerRailProps {
  servers: Server[];
  activeServerId: string | null;
  onSelectServer: (id: string) => void;
}

function ServerRail({ servers, activeServerId, onSelectServer }: ServerRailProps) {
  return (
    <nav className="flex h-full w-17 shrink-0 flex-col items-center gap-3 border-r border-line bg-surface py-4">
      {servers.map((server) => {
        const active = server.id === activeServerId;
        return (
          <button
            key={server.id}
            type="button"
            onClick={() => onSelectServer(server.id)}
            title={server.name}
            aria-pressed={active}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-sm font-bold text-ink transition-all hover:scale-105 ${
              active ? "" : "border-transparent"
            }`}
            style={{
              backgroundColor: `${server.color}26`,
              borderColor: active ? server.color : "transparent",
            }}
          >
            {server.initial}
          </button>
        );
      })}

      <button
        type="button"
        title="Tambah server (segera)"
        className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-dashed border-line text-lg text-muted transition-colors hover:border-primary hover:text-primary"
      >
        +
      </button>
    </nav>
  );
}

export default ServerRail;
