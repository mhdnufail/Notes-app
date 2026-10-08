import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'little-notes-v1'
const COLORS = [
  { name: 'default', label: 'Paper', value: '#ffffff' },
  { name: 'rose', label: 'Rose', value: '#fff0ed' },
  { name: 'peach', label: 'Peach', value: '#fff2df' },
  { name: 'butter', label: 'Butter', value: '#fff8d9' },
  { name: 'sage', label: 'Sage', value: '#eaf3e9' },
  { name: 'mint', label: 'Mint', value: '#e5f4f0' },
  { name: 'sky', label: 'Sky', value: '#eaf2fc' },
  { name: 'lavender', label: 'Lavender', value: '#f1edfa' },
]

const STARTER_NOTES = [
  {
    id: 'welcome-note',
    title: 'A little space for your thoughts',
    content: '<p>Somewhere between the big plans and the little things, there’s a note waiting to be written.</p><p>Start with what’s on your mind. The rest can come later.</p>',
    color: 'butter',
    tags: ['Personal'],
    pinned: true,
    archived: false,
    createdAt: '2026-10-06T09:30:00.000Z',
    updatedAt: '2026-10-06T09:30:00.000Z',
  },
  {
    id: 'weekend-list',
    title: 'A slow Saturday',
    content: '<ul><li>Pick up flowers on the way home</li><li>Finally try the little pasta place</li><li>Read a few chapters in the sun</li></ul>',
    color: 'rose',
    tags: ['Personal', 'Weekend'],
    pinned: false,
    archived: false,
    createdAt: '2026-10-05T14:12:00.000Z',
    updatedAt: '2026-10-05T14:12:00.000Z',
  },
  {
    id: 'project-ideas',
    title: 'Tiny ideas, big potential',
    content: '<p>A monthly supper club with a different cookbook each time.</p><p><strong>First pick:</strong> something with too many beautiful pictures.</p>',
    color: 'sage',
    tags: ['Ideas'],
    pinned: false,
    archived: false,
    createdAt: '2026-10-04T11:45:00.000Z',
    updatedAt: '2026-10-04T11:45:00.000Z',
  },
  {
    id: 'good-things',
    title: 'Things worth remembering',
    content: '<p>The evening light in the kitchen.<br />A text from an old friend.<br />Coffee that stayed warm long enough.</p>',
    color: 'lavender',
    tags: ['Personal'],
    pinned: false,
    archived: false,
    createdAt: '2026-10-03T17:20:00.000Z',
    updatedAt: '2026-10-03T17:20:00.000Z',
  },
  {
    id: 'market-list',
    title: 'Market list',
    content: '<ul><li>Ripe peaches</li><li>Fresh basil</li><li>The good sourdough</li></ul>',
    color: 'mint',
    tags: ['Lists'],
    pinned: false,
    archived: false,
    createdAt: '2026-10-02T08:05:00.000Z',
    updatedAt: '2026-10-02T08:05:00.000Z',
  },
  {
    id: 'book-quote',
    title: 'A line I love',
    content: '<p><em>“And now that you don’t have to be perfect, you can be good.”</em></p>',
    color: 'peach',
    tags: ['Ideas'],
    pinned: false,
    archived: true,
    createdAt: '2026-10-01T19:40:00.000Z',
    updatedAt: '2026-10-01T19:40:00.000Z',
  },
]

const ICONS = {
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
  archive: <><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M3 4h18v3H3zM10 11h4" /></>,
  tag: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V4h9l8.6 8.6a.6.6 0 0 1 0 .8Z" /><circle cx="7.5" cy="8.5" r="1" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  pin: <><path d="m16 3 5 5-4 1-4 4-1 5-3-3-5 5" /><path d="m8 8 8 8" /></>,
  archiveIn: <><path d="M12 11v6m-3-3 3 3 3-3" /><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9h16" /></>,
  trash: <><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  bold: <><path d="M7 5h6a4 4 0 0 1 0 8H7z" /><path d="M7 13h7a4 4 0 0 1 0 8H7z" /></>,
  italic: <><path d="M19 4h-9M14 20H5M15 4 9 20" /></>,
  bullets: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r=".75" /><circle cx="4.5" cy="12" r=".75" /><circle cx="4.5" cy="18" r=".75" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  filter: <><path d="M4 7h16M7 12h10m-7 5h4" /></>,
}

function Icon({ name, size = 18, ...props }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {ICONS[name]}
    </svg>
  )
}

function sanitizeHtml(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'BR', 'P', 'DIV'])
  const cleanNode = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!allowedTags.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent ?? ''))
        } else {
          [...child.attributes].forEach((attribute) => child.removeAttribute(attribute.name))
          cleanNode(child)
        }
      } else if (child.nodeType !== Node.TEXT_NODE) {
        child.remove()
      }
    }
  }
  cleanNode(parsed.body)
  return parsed.body.innerHTML
}

function textFromHtml(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  return parsed.body.textContent ?? ''
}

function readSavedNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return STARTER_NOTES
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) throw new Error('Saved notes have an invalid format.')
    return parsed.filter((note) => note && typeof note.id === 'string' && typeof note.content === 'string').map((note) => ({
      ...note,
      title: typeof note.title === 'string' ? note.title.slice(0, 100) : '',
      content: sanitizeHtml(note.content),
      color: COLORS.some((color) => color.name === note.color) ? note.color : 'default',
      tags: Array.isArray(note.tags) ? note.tags.filter((tag) => typeof tag === 'string').slice(0, 10) : [],
      pinned: Boolean(note.pinned),
      archived: Boolean(note.archived),
    }))
  } catch (error) {
    console.error('Could not load your saved notes.', error)
    throw error
  }
}

function formatDate(date) {
  const then = new Date(date)
  if (Number.isNaN(then.getTime())) return 'Just now'
  const days = Math.floor((Date.now() - then.getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(then)
}

function NoteCard({ note, selected, onEdit, onPin, onArchive, onDelete, onSelect, selectionMode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const cardColor = COLORS.find((color) => color.name === note.color)?.value ?? '#fff'

  return (
    <article
      className={`note-card ${selectionMode ? 'note-card-selectable' : ''} ${selected ? 'note-card-selected' : ''}`}
      style={{ '--note-color': cardColor }}
      aria-label={note.title || 'Untitled note'}
    >
      {selectionMode && <button className={`select-note ${selected ? 'is-selected' : ''}`} type="button" aria-label={selected ? 'Deselect note' : 'Select note'} onClick={(event) => { event.stopPropagation(); onSelect(note.id) }}><Icon name="check" size={14} /></button>}
      <button className={`pin-button ${note.pinned ? 'is-pinned' : ''}`} type="button" aria-label={note.pinned ? 'Unpin note' : 'Pin note'} onClick={(event) => { event.stopPropagation(); onPin(note.id) }}><Icon name="pin" size={16} /></button>
      <button className="note-card-main" type="button" onClick={(event) => { event.stopPropagation(); if (selectionMode) onSelect(note.id); else onEdit(note) }}>
        {note.title && <h3>{note.title}</h3>}
        <div className="note-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }} />
      </button>
      {note.tags.length > 0 && <div className="note-tags">{note.tags.map((tag) => <span key={tag} className="tag-chip">{tag}</span>)}</div>}
      <footer className="note-footer">
        <span className="note-date">{formatDate(note.updatedAt)}</span>
        <div className="note-actions">
          <button type="button" className="icon-button note-action" aria-label={note.archived ? 'Unarchive note' : 'Archive note'} onClick={() => onArchive(note.id)}><Icon name="archive" size={16} /></button>
          <div className="note-menu-wrap">
            <button type="button" className="icon-button note-action" aria-label="More note actions" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name="more" size={17} /></button>
            {menuOpen && <div className="note-menu">
              <button type="button" onClick={() => { setMenuOpen(false); onEdit(note) }}>Edit note</button>
              <button type="button" onClick={() => { setMenuOpen(false); onDelete(note.id) }}>Delete note</button>
            </div>}
          </div>
        </div>
      </footer>
    </article>
  )
}

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [storageReady, setStorageReady] = useState(false)
  const [activeView, setActiveView] = useState('notes')
  const [activeTag, setActiveTag] = useState('')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('updated')
  const [layout, setLayout] = useState('grid')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('default')
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [storageError, setStorageError] = useState('')
  const [editorFocus, setEditorFocus] = useState(false)
  const searchRef = useRef(null)
  const contentRef = useRef(null)
  const editorInitialContent = useRef('')
  const toastTimer = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setNotes(readSavedNotes())
        setStorageReady(true)
      } catch {
        setStorageError('Your saved notes couldn’t be loaded. Check browser storage and refresh to try again.')
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      if (storageError) window.setTimeout(() => setStorageError(''), 0)
    } catch (error) {
      console.error('Could not save your notes.', error)
      window.setTimeout(() => setStorageError('Your changes couldn’t be saved. Your browser storage may be full.'), 0)
    }
  }, [notes, storageReady, storageError])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const announce = useCallback((message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2800)
  }, [])

  const openEditor = (note = null) => {
    setEditingId(note?.id ?? null)
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
    editorInitialContent.current = note?.content ?? ''
    setColor(note?.color ?? 'default')
    setTagInput(note?.tags?.join(', ') ?? '')
    setErrors({})
    setEditorOpen(true)
    setEditorFocus(false)
  }

  const setEditorRef = useCallback((element) => {
    contentRef.current = element
    if (element) element.innerHTML = editorInitialContent.current
  }, [])

  const allTags = useMemo(() => [...new Set(notes.flatMap((note) => note.tags))].sort((a, b) => a.localeCompare(b)), [notes])

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const filtered = notes.filter((note) => {
      if (Boolean(note.archived) !== (activeView === 'archive')) return false
      if (activeTag && !note.tags.includes(activeTag)) return false
      return !normalizedQuery || `${note.title} ${textFromHtml(note.content)} ${note.tags.join(' ')}`.toLocaleLowerCase().includes(normalizedQuery)
    })
    const compare = sortBy === 'title'
      ? (a, b) => (a.title || '').localeCompare(b.title || '') || b.updatedAt.localeCompare(a.updatedAt)
      : sortBy === 'color'
        ? (a, b) => COLORS.findIndex((item) => item.name === a.color) - COLORS.findIndex((item) => item.name === b.color)
        : (a, b) => b.updatedAt.localeCompare(a.updatedAt)
    return filtered.sort((a, b) => Number(b.pinned) - Number(a.pinned) || compare(a, b))
  }, [notes, activeView, activeTag, query, sortBy])

  useEffect(() => {
    const onKeyDown = (event) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable
      if (event.key === 'Escape') {
        if (confirmDelete) setConfirmDelete(null)
        else if (editorOpen) setEditorOpen(false)
        else if (selectionMode) { setSelectionMode(false); setSelectedIds([]) }
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && editorOpen) {
        event.preventDefault()
        document.getElementById('note-form')?.requestSubmit()
      }
      if (typing || event.ctrlKey || event.metaKey || event.altKey || confirmDelete) return
      if (event.key === '/') { event.preventDefault(); searchRef.current?.focus() }
      if (event.key.toLowerCase() === 'n') { event.preventDefault(); openEditor() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmDelete, editorOpen, selectionMode])

  const submitNote = (event) => {
    event.preventDefault()
    const cleanContent = sanitizeHtml(contentRef.current?.innerHTML ?? content)
    const plainContent = textFromHtml(cleanContent).trim()
    const cleanTitle = title.trim()
    const nextErrors = {}
    if (!plainContent) nextErrors.content = 'A note needs a little something in it.'
    if (cleanTitle.length > 100) nextErrors.title = 'Keep your title under 100 characters.'
    if (plainContent.length > 10000) nextErrors.content = 'Notes can be up to 10,000 characters.'
    const tags = [...new Set(tagInput.split(',').map((tag) => tag.trim()).filter(Boolean))]
    if (tags.length > 10) nextErrors.tags = 'Add up to 10 tags per note.'
    if (tags.some((tag) => tag.length > 30)) nextErrors.tags = 'Each tag must be 30 characters or fewer.'
    const duplicate = notes.some((note) => note.id !== editingId && note.title.trim().toLocaleLowerCase() === cleanTitle.toLocaleLowerCase() && textFromHtml(note.content).trim().toLocaleLowerCase() === plainContent.toLocaleLowerCase())
    if (duplicate) nextErrors.content = 'You already have a note with this title and content.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const now = new Date().toISOString()
    if (editingId) {
      setNotes((previous) => previous.map((note) => note.id === editingId ? { ...note, title: cleanTitle, content: cleanContent, color, tags, updatedAt: now } : note))
      announce('Note updated')
    } else {
      setNotes((previous) => [{ id: crypto.randomUUID(), title: cleanTitle, content: cleanContent, color, tags, pinned: false, archived: false, createdAt: now, updatedAt: now }, ...previous])
      announce('Note added')
    }
    setEditorOpen(false)
  }

  const togglePin = (id) => {
    setNotes((previous) => previous.map((note) => note.id === id ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() } : note))
  }

  const toggleArchive = (id) => {
    const note = notes.find((item) => item.id === id)
    setNotes((previous) => previous.map((item) => item.id === id ? { ...item, archived: !item.archived, updatedAt: new Date().toISOString() } : item))
    announce(note?.archived ? 'Note moved back to notes' : 'Note archived')
  }

  const deleteNotes = (ids) => {
    setNotes((previous) => previous.filter((note) => !ids.includes(note.id)))
    setSelectedIds([])
    setSelectionMode(false)
    setConfirmDelete(null)
    announce(ids.length > 1 ? `${ids.length} notes deleted` : 'Note deleted')
  }

  const formatSelection = (command) => {
    contentRef.current?.focus()
    document.execCommand(command, false)
    setContent(contentRef.current?.innerHTML ?? '')
    setEditorFocus(true)
  }

  const setView = (view) => {
    setActiveView(view)
    setActiveTag('')
    setSelectedIds([])
    setSelectionMode(false)
  }

  const toggleSelected = (id) => setSelectedIds((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id])
  const hasContent = visibleNotes.length > 0
  const pageHeading = activeView === 'archive' ? 'Archive' : activeTag ? activeTag : query ? 'Search results' : 'Your notes'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Little Notes home" onClick={(event) => { event.preventDefault(); setView('notes') }}>
          <span className="brand-mark"><Icon name="spark" size={20} /></span>
          <span className="brand-name">little<span>notes</span></span>
        </a>
        <label className="search-box">
          <Icon name="search" size={19} />
          <input ref={searchRef} aria-label="Search notes" placeholder="Search your notes" value={query} onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" className="icon-button search-clear" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
          {!query && <kbd>/</kbd>}
        </label>
        <div className="topbar-actions">
          <span className={`saved-indicator ${storageError ? 'save-failed' : ''}`}><span />{storageError ? 'Not saved' : loading ? 'Loading notes' : 'All changes saved'}</span>
          <button type="button" className="avatar" aria-label="Your space">A</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <button type="button" className="new-note-button" onClick={() => openEditor()}><Icon name="plus" size={18} /> <span>New note</span><kbd>N</kbd></button>
          <div className="sidebar-section">
            <span className="sidebar-label">YOUR SPACE</span>
            <button type="button" className={`nav-link ${activeView === 'notes' && !activeTag ? 'active' : ''}`} onClick={() => setView('notes')}><Icon name="grid" size={18} /><span>Notes</span><span className="nav-count">{notes.filter((note) => !note.archived).length}</span></button>
            <button type="button" className={`nav-link ${activeView === 'archive' ? 'active' : ''}`} onClick={() => setView('archive')}><Icon name="archive" size={18} /><span>Archive</span><span className="nav-count">{notes.filter((note) => note.archived).length}</span></button>
          </div>
          <div className="sidebar-section tag-section">
            <div className="section-heading"><span className="sidebar-label">YOUR TAGS</span><Icon name="tag" size={14} /></div>
            {allTags.length === 0 ? <p className="no-tags">Your tags will show up here.</p> : allTags.map((tag) => <button key={tag} type="button" className={`nav-link tag-link ${activeTag === tag ? 'active' : ''}`} onClick={() => { setActiveView('notes'); setActiveTag(activeTag === tag ? '' : tag); setSelectedIds([]); setSelectionMode(false) }}><span className="tag-dot" /><span>{tag}</span><span className="nav-count">{notes.filter((note) => !note.archived && note.tags.includes(tag)).length}</span></button>)}
          </div>
          <div className="sidebar-bottom"><div className="sidebar-decoration">✳</div><p>A soft place to land<br />all your little thoughts.</p><span>MADE FOR THE MOMENTS IN BETWEEN</span></div>
        </aside>

        <main className="main-content">
          <div className="page-heading">
            <div><p className="eyebrow">{activeView === 'archive' ? 'TUCKED AWAY FOR LATER' : activeTag ? 'A LITTLE COLLECTION' : 'A QUIET CORNER OF YOUR MIND'}</p><h1>{pageHeading}<span className="heading-period">.</span></h1></div>
            <div className="page-controls">
              {hasContent && <button type="button" className="text-control select-control" onClick={() => { setSelectionMode(!selectionMode); setSelectedIds([]) }}>{selectionMode ? 'Done' : 'Select'}</button>}
              <label className="sort-control"><Icon name="filter" size={16} /><select aria-label="Sort notes" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="updated">Last edited</option><option value="title">Title</option><option value="color">Color</option></select></label>
              <div className="layout-toggle" aria-label="Note layout">
                <button type="button" className={layout === 'grid' ? 'layout-active' : ''} aria-label="Grid view" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}><Icon name="grid" size={17} /></button>
                <button type="button" className={layout === 'list' ? 'layout-active' : ''} aria-label="List view" aria-pressed={layout === 'list'} onClick={() => setLayout('list')}><Icon name="list" size={18} /></button>
              </div>
            </div>
          </div>

          {activeView === 'notes' && allTags.length > 0 && <nav className="mobile-tags" aria-label="Filter notes by tag">
            <button type="button" className={!activeTag ? 'mobile-tag-active' : ''} onClick={() => setActiveTag('')}>All notes</button>
            {allTags.map((tag) => <button key={tag} type="button" className={activeTag === tag ? 'mobile-tag-active' : ''} onClick={() => setActiveTag(activeTag === tag ? '' : tag)}>{tag}</button>)}
          </nav>}

          {activeView === 'notes' && !activeTag && !query && <button type="button" className="quick-compose" onClick={() => openEditor()}><span className="quick-compose-icon"><Icon name="plus" size={18} /></span><span>Catch a thought before it floats away...</span><span className="quick-compose-end">✳</span></button>}

          {selectionMode && selectedIds.length > 0 && <div className="bulk-toolbar"><span>{selectedIds.length} selected</span><button type="button" onClick={() => { const ids = selectedIds; setNotes((previous) => previous.map((note) => ids.includes(note.id) ? { ...note, archived: activeView !== 'archive', updatedAt: new Date().toISOString() } : note)); setSelectedIds([]); announce(activeView === 'archive' ? 'Notes moved back to notes' : 'Notes archived') }}><Icon name="archiveIn" size={16} />{activeView === 'archive' ? 'Unarchive' : 'Archive'}</button><button type="button" className="bulk-delete" onClick={() => setConfirmDelete(selectedIds)}><Icon name="trash" size={16} />Delete</button></div>}

          {loading ? <div className="loading-state" aria-label="Loading notes"><span /><span /><span /></div> : hasContent ? (
            <>
              {visibleNotes.some((note) => note.pinned) && <p className="notes-subheading"><Icon name="pin" size={14} /> PINNED</p>}
              <div className={`notes-grid ${layout === 'list' ? 'notes-list' : ''}`}>
                {visibleNotes.filter((note) => note.pinned).map((note) => <NoteCard key={note.id} note={note} selected={selectedIds.includes(note.id)} selectionMode={selectionMode} onSelect={toggleSelected} onEdit={openEditor} onPin={togglePin} onArchive={toggleArchive} onDelete={(id) => setConfirmDelete([id])} />)}
              </div>
              {visibleNotes.some((note) => note.pinned) && visibleNotes.some((note) => !note.pinned) && <p className="notes-subheading all-notes-heading">ALL NOTES</p>}
              <div className={`notes-grid ${layout === 'list' ? 'notes-list' : ''}`}>
                {visibleNotes.filter((note) => !note.pinned).map((note) => <NoteCard key={note.id} note={note} selected={selectedIds.includes(note.id)} selectionMode={selectionMode} onSelect={toggleSelected} onEdit={openEditor} onPin={togglePin} onArchive={toggleArchive} onDelete={(id) => setConfirmDelete([id])} />)}
              </div>
            </>
          ) : <div className="empty-state"><div className="empty-illustration"><span className="empty-sun">✳</span><span className="empty-note" /></div><p className="empty-eyebrow">{query || activeTag ? 'NOTHING HERE JUST YET' : activeView === 'archive' ? 'A LITTLE BREATHING ROOM' : 'A FRESH PAGE'}</p><h2>{query ? 'No notes found' : activeTag ? `No notes tagged “${activeTag}”` : activeView === 'archive' ? 'Nothing tucked away.' : 'Room for a new thought.'}</h2><p>{query ? 'Try a different search — the right words might be just around the corner.' : activeView === 'archive' ? 'When a note’s had its moment, you’ll find it here.' : 'A thought, a list, a passing little idea. It all belongs here.'}</p>{activeView === 'notes' && <button type="button" className="empty-cta" onClick={() => openEditor()}><Icon name="plus" size={17} /> Write your first note</button>}</div>}

          <div className="page-footer"><span>✳</span> There’s no rush. Take your time.</div>
        </main>
      </div>

      {editorOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false) }}>
        <form id="note-form" className={`editor-modal editor-${color}`} onSubmit={submitNote}>
          <div className="editor-top"><span className="editor-label">{editingId ? 'A NOTE IN PROGRESS' : 'A NEW LITTLE THOUGHT'}</span><button type="button" className="icon-button close-button" aria-label="Close editor" onClick={() => setEditorOpen(false)}><Icon name="close" size={19} /></button></div>
          <input className="title-input" aria-label="Note title" placeholder="A title, if you like..." value={title} maxLength={100} onChange={(event) => setTitle(event.target.value)} />
          {errors.title && <p className="field-error">{errors.title}</p>}
          <div ref={setEditorRef} className={`content-editor ${editorFocus ? 'editor-has-focus' : ''}`} contentEditable suppressContentEditableWarning role="textbox" aria-label="Note content" aria-multiline="true" data-placeholder="Let your thoughts wander..." onFocus={() => setEditorFocus(true)} onPaste={(event) => { event.preventDefault(); const html = event.clipboardData.getData('text/html'); if (html) document.execCommand('insertHTML', false, sanitizeHtml(html)); else document.execCommand('insertText', false, event.clipboardData.getData('text/plain')) }} onInput={(event) => { setContent(event.currentTarget.innerHTML); if (errors.content) setErrors((previous) => ({ ...previous, content: '' })) }} />
          {errors.content && <p className="field-error">{errors.content}</p>}
          <div className="editor-tools">
            <div className="format-tools"><button type="button" aria-label="Bold" title="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => formatSelection('bold')}><Icon name="bold" size={17} /></button><button type="button" aria-label="Italic" title="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => formatSelection('italic')}><Icon name="italic" size={17} /></button><button type="button" aria-label="Bulleted list" title="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => formatSelection('insertUnorderedList')}><Icon name="bullets" size={18} /></button></div>
            <div className="color-picker" aria-label="Note color">{COLORS.map((item) => <button key={item.name} type="button" title={item.label} aria-label={`${item.label} note color`} aria-pressed={color === item.name} className={`color-swatch ${color === item.name ? 'swatch-active' : ''}`} style={{ '--swatch-color': item.value }} onClick={() => setColor(item.name)}>{color === item.name && <Icon name="check" size={12} />}</button>)}</div>
          </div>
          <label className="tag-input-wrap"><Icon name="tag" size={15} /><input aria-label="Tags" placeholder="Add tags, separated by commas" value={tagInput} maxLength={318} onChange={(event) => { setTagInput(event.target.value); if (errors.tags) setErrors((previous) => ({ ...previous, tags: '' })) }} /><span>{tagInput.length}/318</span></label>
          {errors.tags && <p className="field-error">{errors.tags}</p>}
          <div className="editor-bottom"><span>{textFromHtml(content).length}/10,000 <span className="shortcut-hint">· Ctrl + Enter to save</span></span><button type="submit" className="save-button">{editingId ? 'Save changes' : 'Save note'} <span>↗</span></button></div>
        </form>
      </div>}

      {confirmDelete && <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmDelete(null) }}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-heading"><div className="confirm-icon"><Icon name="trash" size={19} /></div><h2 id="delete-heading">{confirmDelete.length > 1 ? `Delete ${confirmDelete.length} notes?` : 'Let this note go?'}</h2><p>This can’t be undone, but it’s okay to make room for something new.</p><div className="confirm-actions"><button type="button" className="cancel-button" onClick={() => setConfirmDelete(null)}>Keep note</button><button type="button" className="confirm-delete-button" onClick={() => deleteNotes(confirmDelete)}>Delete {confirmDelete.length > 1 ? 'notes' : 'note'}</button></div></div></div>}

      {storageError && <div className="storage-warning" role="alert">{storageError}<button type="button" className="icon-button" aria-label="Dismiss storage warning" onClick={() => setStorageError('')}><Icon name="close" size={15} /></button></div>}
      {toast && <div className="toast-message" role="status"><span><Icon name="check" size={15} /></span>{toast}</div>}
      <nav className="mobile-footer" aria-label="Main navigation">
        <button type="button" className={`mobile-tab ${activeView === 'notes' ? 'mobile-tab-active' : ''}`} onClick={() => setView('notes')}><Icon name="grid" size={17} /><span>Notes</span><span className="mobile-tab-count">{notes.filter((note) => !note.archived).length}</span></button>
        <button type="button" className="mobile-tab mobile-new-tab" onClick={() => openEditor()}><span className="mobile-new-icon"><Icon name="plus" size={19} /></span><span>New note</span></button>
        <button type="button" className={`mobile-tab ${activeView === 'archive' ? 'mobile-tab-active' : ''}`} onClick={() => setView('archive')}><Icon name="archive" size={17} /><span>Archive</span><span className="mobile-tab-count">{notes.filter((note) => note.archived).length}</span></button>
      </nav>
    </div>
  )
}

export default App
