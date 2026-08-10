import type { ActiveView, Channel, DirectConversation } from "../../types/chat";
import { MaskIcon } from "../icons";

interface ChannelSidebarProps {
  serverName: string;
  channels: Channel[];
  dms: DirectConversation[];
  activeView: ActiveView;
  onSelectChannel: (id: string) => void;
  onSelectDm: (id: string) => void;
}

function ChannelSidebar({
  serverName,
  channels,
  dms,
  activeView,
  onSelectChannel,
  onSelectDm,
}: ChannelSidebarProps) {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-line bg-surface sm:flex">
      {/* Header server */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-4">
        <span className="font-display text-base font-bold text-ink">{serverName}</span>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        {/* Channels */}
        <div className="flex flex-col gap-1">
          <h3 className="px-2 font-mono text-[11px] uppercase tracking-widest text-muted">
            Channels
          </h3>
          {channels.map((channel) => {
            const active = activeView.kind === "channel" && activeView.id === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => onSelectChannel(channel.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 font-semibold text-ink"
                    : "text-muted hover:bg-elevate hover:text-ink"
                }`}
              >
                <span className="text-muted" aria-hidden="true">
                  {channel.kind === "anon" ? <MaskIcon className="h-3.5 w-3.5" /> : "#"}
                </span>
                {channel.name}
              </button>
            );
          })}
        </div>

        {/* Direct Messages */}
        <div className="flex flex-col gap-1">
          <h3 className="px-2 font-mono text-[11px] uppercase tracking-widest text-muted">
            Direct Messages
          </h3>
          {dms.map((dm) => {
            const active = activeView.kind === "dm" && activeView.id === dm.id;
            return (
              <button
                key={dm.id}
                type="button"
                onClick={() => onSelectDm(dm.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 font-semibold text-ink"
                    : "text-muted hover:bg-elevate hover:text-ink"
                }`}
              >
                <span className="relative shrink-0">
                  <img src={dm.avatar} alt={dm.userName} className="h-6 w-6 rounded-full object-cover" />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface ${
                      dm.online ? "bg-neon" : "bg-muted"
                    }`}
                  />
                </span>
                <span className="truncate">{dm.userName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default ChannelSidebar;
