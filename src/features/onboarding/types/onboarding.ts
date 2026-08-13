/**
 * Onboarding kini berupa kuesioner skala Likert yang dibuat oleh dosen.
 */

export interface LikertQuestion {
  id: string;
  /** pernyataan yang dinilai user pada skala Likert. */
  text: string;
  /** roleId yang diperkuat jika user setuju dengan pernyataan ini. */
  roleId: string;
}
