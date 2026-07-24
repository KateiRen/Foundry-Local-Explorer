import type { EpStatus } from '@shared/types'
import HardwarePanel from './HardwarePanel'

export type ViewId = 'catalog' | 'manage' | 'chat' | 'embeddings' | 'transcribe' | 'server'

interface Props {
  active: ViewId
  onChange: (view: ViewId) => void
  eps: EpStatus[]
  epsLoading: boolean
}

const NAV_ITEMS: { id: ViewId; label: string; icon: string }[] = [
  { id: 'catalog', label: 'Model Catalog', icon: '📦' },
  { id: 'manage', label: 'Manage Models', icon: '🗂️' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'embeddings', label: 'Embeddings', icon: '🧬' },
  { id: 'transcribe', label: 'Transcribe', icon: '🎙️' },
  { id: 'server', label: 'Local Server', icon: '🌐' }
]

function Sidebar({ active, onChange, eps, epsLoading }: Props): React.JSX.Element {
  return (
    <nav className="sidebar">
      <div className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
      <hr className="sidebar-separator" />
      <HardwarePanel eps={eps} loading={epsLoading} />
    </nav>
  )
}

export default Sidebar
