/**
 * SidebarToggle — tombol burger yang mengambang tepat di tepi kanan sidebar,
 * vertikal sejajar dengan garis batas antara header logo dan nav items (top-14).
 *
 * Dirender di AppLayout (di luar AppSidebar) agar bisa ditempatkan secara
 * absolute relatif terhadap container flex utama.
 */

interface SidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}

function SidebarToggle({ open, onToggle }: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={open ? "Collapse sidebar" : "Expand sidebar"}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      /**
       * Posisi:
       * - `absolute` keluar dari flow
       * - `top-14` = tinggi header logo (h-14) → tombol duduk tepat di garis batas
       * - `-translate-y-1/2` → geser ke atas setengah tinggi tombol
       *   sehingga tombol melintasi garis batas secara simetris
       * - left di-set dinamis via inline style supaya mengikuti lebar sidebar
       *   yang berubah karena transition (tidak bisa pakai Tailwind statis)
       * - `-translate-x-1/2` → geser ke kiri setengah lebar tombol
       *   sehingga tombol tepat di tepi kanan sidebar
       * - `z-20` → di atas sidebar dan konten
       */
      className="absolute z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-line bg-surface text-muted shadow-sm transition-colors hover:bg-elevate hover:text-ink"
      style={{ top: "3.5rem", left: "var(--sidebar-width)", transition: "left 200ms ease-out" }}
    >
      {/* Burger icon — 3 garis horizontal */}
      <span className="flex flex-col gap-[3.5px]">
        <span className="block h-px w-3.5 bg-current" />
        <span className="block h-px w-3.5 bg-current" />
        <span className="block h-px w-3.5 bg-current" />
      </span>
    </button>
  );
}

export default SidebarToggle;
