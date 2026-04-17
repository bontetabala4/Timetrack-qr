import { Scanner } from '@yudiel/react-qr-scanner'

type QrCameraScannerProps = {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (errorMessage: string) => void
}

export default function QrCameraScanner({
  onScanSuccess,
  onScanError,
}: QrCameraScannerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950">
      <Scanner
        onScan={(results) => {
          if (!results || results.length === 0) return

          const value = results[0]?.rawValue

          if (value) {
            onScanSuccess(value)
          }
        }}
        onError={(error) => {
          const message =
            error instanceof Error ? error.message : 'Erreur de lecture caméra'

          if (onScanError) {
            onScanError(message)
          }
        }}
        constraints={{
          facingMode: 'environment',
        }}
        styles={{
          container: {
            width: '100%',
          },
        }}
      />
    </div>
  )
}