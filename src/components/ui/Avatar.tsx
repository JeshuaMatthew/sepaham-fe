import { useState } from "react";

interface AvatarProps {
  /** URL gambar. String kosong / null / error jaringan -> inisial. */
  src?: string | null;
  /** Nama orang; dipakai untuk inisial fallback dan sebagai alt default. */
  name?: string;
  /** Override teks alt (kosongkan bila avatar dekoratif). */
  alt?: string;
  /** Class untuk elemen luar — penganggil yang menentukan ukuran & bentuk. */
  className?: string;
  /** Class tambahan khusus elemen <img>. */
  imgClassName?: string;
  /** Class tambahan khusus fallback inisial. */
  fallbackClassName?: string;
  /** Tandai elemen untuk animasi intro (GSAP `gsap.from("[data-intro]")`). */
  dataIntro?: boolean;
}

/** Inisial dari nama: "Siti Rahma" -> "SR", "budi" -> "B", "" -> "?". */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0][0] ?? "?").toUpperCase();
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

/**
 * Avatar yang tidak pernah tampil sebagai gambar rusak.
 *
 * `<img src={avatar}>` polos menghasilkan ikon gambar patah + alt text kalau
 * `avatar` kosong (user yang belum set avatar) atau URL-nya mati. Di sini
 * kondisi itu ditangani: fallback berupa inisial di dalam lingkaran, dengan
 * warna turunan tema (`bg-elevate` + `text-muted`) supaya tetap konsisten di
 * mode terang maupun gelap.
 */
function Avatar({
  src,
  name = "",
  alt,
  className = "h-7 w-7 rounded-full",
  imgClassName = "object-cover",
  fallbackClassName = "",
  dataIntro = false,
}: AvatarProps) {
  const trimmed = src?.trim() ?? "";
  // Status error disimpan bersama src-nya, sehingga saat `src` berubah status
  // lama otomatis tidak berlaku lagi — tanpa butuh effect untuk me-reset.
  const [failed, setFailed] = useState<{ src: string } | null>(null);
  const showImage = trimmed !== "" && failed?.src !== trimmed;

  if (showImage) {
    return (
      <img
        src={trimmed}
        alt={alt ?? name}
        onError={() => setFailed({ src: trimmed })}
        data-intro={dataIntro ? "" : undefined}
        className={`${className} ${imgClassName}`}
      />
    );
  }

  return (
    <span
      // Fallback tetap harus terbaca screen reader sebagai identitas orang.
      role="img"
      aria-label={alt ?? (name || "Pengguna tanpa nama")}
      data-intro={dataIntro ? "" : undefined}
      className={`${className} flex shrink-0 items-center justify-center overflow-hidden bg-elevate font-display font-semibold text-muted ${fallbackClassName}`}
    >
      {initialsOf(name)}
    </span>
  );
}

export default Avatar;
