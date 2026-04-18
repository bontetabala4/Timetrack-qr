import { useEffect, useRef, useState } from 'react'
import { Download, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { fetchCurrentQr, generateQr, type QrData } from '../../services/qrcode'

export default function QrCodes() {
  const { token } = useAuth()
  const { showToast } = useToast()
  const qrCanvasWrapperRef = useRef<HTMLDivElement | null>(null)

  const [qr, setQr] = useState<QrData>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadQr = async (refresh = false) => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }

      const data = await fetchCurrentQr(token)
      setQr(data.qr)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur de chargement du QR'
      showToast(message, 'error')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadQr()
  }, [token])

  const handleGenerate = async () => {
    if (!token) return

    try {
      setIsGenerating(true)
      const data = await generateQr(token)
      setQr(data.qr)
      showToast(data.message || 'QR généré avec succès', 'success')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la génération'
      showToast(message, 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadQr = () => {
    const canvas = qrCanvasWrapperRef.current?.querySelector('canvas')

    if (!canvas || !qr) {
      showToast('QR introuvable pour le téléchargement', 'error')
      return
    }

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `timetrack-qr-${qr.date}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AdminLayout
      title="QR Codes"
      subtitle="QR actif de votre organisation pour la journée"
      onRefresh={() => void loadQr(true)}
      isRefreshing={isRefreshing}
    >
      <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
        {loading ? (
          <div className="text-slate-300">Chargement du QR...</div>
        ) : qr ? (
          <div className="flex flex-col items-center gap-6">
            <div
              ref={qrCanvasWrapperRef}
              className="rounded-3xl bg-white p-4 shadow-xl sm:p-5"
            >
              <QRCodeCanvas value={qr.code} size={220} />
            </div>

            <div className="w-full max-w-2xl space-y-4 text-center">
              <div>
                <p className="text-sm text-slate-400">Code QR actif du jour</p>
                <p className="mt-2 break-all text-xs text-white sm:text-sm">
                  {qr.code}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-900/50 p-4">
                  <p className="text-sm text-slate-400">Date du QR</p>
                  <p className="mt-2 text-lg font-bold text-emerald-400 sm:text-2xl">
                    {new Date(qr.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/50 p-4">
                  <p className="text-sm text-slate-400">Période d’activité</p>
                  <p className="mt-2 text-base font-bold text-white sm:text-lg">
                    07h30 → fin de journée
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-400">
                Ce QR est imprimable. Les agents peuvent le scanner sur papier
                si la tablette n’est pas disponible.
              </p>
            </div>

            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <button
                onClick={() => void handleGenerate()}
                disabled={isGenerating}
                className="flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-slate-950/30 border-t-slate-950">
                      <span className="text-[10px] font-bold">TT</span>
                    </span>
                    Vérification...
                  </>
                ) : (
                  'Vérifier ou régénérer le QR du jour'
                )}
              </button>

              <button
                onClick={handleDownloadQr}
                disabled={!qr}
                className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download size={18} />
                Télécharger le QR
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="rounded-2xl bg-slate-900/40 p-4">
              <QrCode className="mx-auto text-emerald-400" size={40} />
            </div>

            <p className="text-slate-300">Aucun QR actif pour aujourd’hui.</p>

            <button
              onClick={() => void handleGenerate()}
              disabled={isGenerating}
              className="flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-slate-950/30 border-t-slate-950">
                    <span className="text-[10px] font-bold">TT</span>
                  </span>
                  Génération...
                </>
              ) : (
                'Générer le QR du jour'
              )}
            </button>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}