import { useCallback, useEffect, useState } from 'react'
import Sidebar, { type ViewId } from './components/Sidebar'
import CatalogView from './views/CatalogView'
import ManageModelsView from './views/ManageModelsView'
import ChatView from './views/ChatView'
import EmbeddingsView from './views/EmbeddingsView'
import TranscribeView from './views/TranscribeView'
import ServerView from './views/ServerView'
import type { EpStatus } from '@shared/types'

function App(): React.JSX.Element {
  const [view, setView] = useState<ViewId>('catalog')
  const [eps, setEps] = useState<EpStatus[]>([])
  const [epsLoading, setEpsLoading] = useState(true)

  const refreshEps = useCallback(async () => {
    const epList = await window.api.foundry.discoverEps()
    setEps(epList)
    return epList
  }, [])

  useEffect(() => {
    let mounted = true
    setEpsLoading(true)
    refreshEps()
      .then((epList) => {
        if (!mounted) return
        // Auto-register every discovered EP on startup so the full catalog is
        // visible right away, instead of requiring the user to manually
        // register before device-specific model variants show up.
        // Registration is a fast no-op for EPs already registered in a prior
        // session (their redistributables are cached locally).
        const unregistered = epList.filter((ep) => !ep.isRegistered).map((ep) => ep.name)
        if (unregistered.length > 0) {
          window.api.foundry
            .registerEps(unregistered)
            .then(() => refreshEps())
            .catch((err) => console.error('Failed to auto-register execution providers', err))
        }
      })
      .finally(() => {
        if (mounted) setEpsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [refreshEps])

  return (
    <div className="app-shell">
      <Sidebar active={view} onChange={setView} eps={eps} epsLoading={epsLoading} />
      <main className="app-content">
        {view === 'catalog' && <CatalogView eps={eps} />}
        {view === 'manage' && <ManageModelsView />}
        {view === 'chat' && <ChatView />}
        {view === 'embeddings' && <EmbeddingsView />}
        {view === 'transcribe' && <TranscribeView />}
        {view === 'server' && <ServerView />}
      </main>
    </div>
  )
}

export default App
