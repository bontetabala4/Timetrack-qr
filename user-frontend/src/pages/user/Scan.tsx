import { useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { scanAttendance } from '../../services/attendance'
import QrCameraScanner from '../../components/scan/QrCameraScanner'

type ScanResult = {
  type: 'success' | 'late' | 'error' | null
  title: string
  description: string
}

export default function Scan() {
  const { token } = useAuth()
  const { showToast } = useToast()

  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult>({
    type: null,
    title: '',
    description: '',
  })

  const handleDecodedScan = async (decodedText: string) => {
    if (!token || isScanning) return

    try {
      setIsScanning(true)

      const data = await scanAttendance(token, decodedText)

      if (data.attendance.status === 'late') {
        setResult({
          type: 'late',
          title: 'Retard enregistré',
          description: `Votre présence a été enregistrée avec ${data.attendance.lateMinutes} minute(s) de retard.`,
        })
        showToast('Présence enregistrée avec retard', 'success')
      } else {
        setResult({
          type: 'success',
          title: 'Présence enregistrée',
          description: 'Votre scan a été validé avec succès pour aujourd’hui.',
        })
        showToast('Présence enregistrée avec succès', 'success')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'QR invalide ou expiré'

      setResult({
        type: 'error',
        title: 'Scan refusé',
        description: message,
      })

      showToast(message, 'error')
    } finally {
      setTimeout(() => {
        setIsScanning(false)
      }, 1500)
    }
  }

  const handleScannerError = (message: string) => {
    console.error('QR scanner error:', message)
  }

  return (
    <UserLayout>
      <section className="space-y-6">
        <div className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h1 className="text-2xl font-bold">Scanner le QR du jour</h1>
          <p className="user-theme-muted mt-2 text-sm">
            Place le QR de ton organisation devant la caméra.
          </p>
        </div>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <QrCameraScanner
            onScanSuccess={(decodedText) => void handleDecodedScan(decodedText)}
            onScanError={handleScannerError}
          />

          {isScanning && (
            <div className="user-theme-soft mt-6 flex items-center justify-center gap-3 rounded-2xl border p-4 transition-colors duration-300">
              <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-current/20 border-t-current">
                <span className="text-[10px] font-bold">TT</span>
              </span>
              Vérification du QR...
            </div>
          )}

          {result.type && (
            <div
              className={`mt-6 rounded-2xl border p-5 ${
                result.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : result.type === 'late'
                    ? 'border-amber-500/20 bg-amber-500/10'
                    : 'border-red-500/20 bg-red-500/10'
              }`}
            >
              <h2
                className={`text-lg font-semibold ${
                  result.type === 'success'
                    ? 'text-emerald-400'
                    : result.type === 'late'
                      ? 'text-amber-400'
                      : 'text-red-400'
                }`}
              >
                {result.title}
              </h2>

              <p className="mt-2">{result.description}</p>
            </div>
          )}
        </section>
      </section>
    </UserLayout>
  )
}