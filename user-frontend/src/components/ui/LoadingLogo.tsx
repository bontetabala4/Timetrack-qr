type LoadingLogoProps = {
  label?: string
}

export default function LoadingLogo({
  label = 'Chargement...',
}: LoadingLogoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
        TT
      </div>
      <p className="text-sm font-medium text-slate-300">{label}</p>
    </div>
  )
}