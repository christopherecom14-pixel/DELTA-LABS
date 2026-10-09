import { PIPELINE } from "@/lib/recruitment/config";

const TONES: Record<string, string> = {
  new: "bg-[#eef1ff] text-[#1d33b8] border-[#cdd6ff]",
  "under-review": "bg-[#f4f3ff] text-[#5925dc] border-[#d9d6fe]",
  shortlisted: "bg-[#ecfdf3] text-[#067647] border-[#abefc6]",
  assessment: "bg-[#fffaeb] text-[#b54708] border-[#fedf89]",
  interview: "bg-[#fdf2fa] text-[#c11574] border-[#fcceee]",
  selected: "bg-[#067647] text-white border-[#067647]",
  rejected: "bg-[#f2f4f7] text-[#475467] border-[#d0d5dd]",
  "talent-pool": "bg-[#f0f9ff] text-[#026aa2] border-[#b9e6fe]",
};

export function StatusBadge({ status }: { status: string }) {
  const label = PIPELINE.find((p) => p.id === status)?.label ?? status;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[status] ?? TONES.rejected}`}>
      {label}
    </span>
  );
}
