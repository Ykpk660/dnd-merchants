import { useState } from 'react'

export default function MerchantList({
  merchants, groups, onSelect, onCreate, onEdit,
  onCreateGroup, onRenameGroup, onDeleteGroup
}) {
  const [newGroupName, setNewGroupName] = useState('')
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const [collapsed, setCollapsed] = useState({})

  function handleCreateGroup() {
    const name = newGroupName.trim()
    if (!name) return
    onCreateGroup(name)
    setNewGroupName('')
  }

  function startRename(g) {
    setRenamingId(g.id)
    setRenameVal(g.name)
  }

  function confirmRename(id) {
    if (renameVal.trim()) onRenameGroup(id, renameVal.trim())
    setRenamingId(null)
  }

  function toggleCollapse(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const ungrouped = merchants.filter(m => !m.groupId || !groups.find(g => g.id === Number(m.groupId)))

  return (
    <div className="screen list-screen">
      <div className="list-header">
        <h1>Торговцы</h1>
        <button className="btn-primary" onClick={onCreate}>+ Создать</button>
      </div>

      {/* Группы */}
      {groups.map(g => {
        const members = merchants.filter(m => Number(m.groupId) === g.id)
        const isCollapsed = collapsed[g.id]
        return (
          <div key={g.id} className="group-block">
            <div className="group-header">
              <button className="group-toggle" onClick={() => toggleCollapse(g.id)}>
                {isCollapsed ? '▶' : '▼'}
              </button>
              {renamingId === g.id ? (
                <input
                  className="group-rename-input"
                  value={renameVal}
                  autoFocus
                  onChange={e => setRenameVal(e.target.value)}
                  onBlur={() => confirmRename(g.id)}
                  onKeyDown={e => e.key === 'Enter' && confirmRename(g.id)}
                />
              ) : (
                <span className="group-name" onDoubleClick={() => startRename(g)}>{g.name}</span>
              )}
              <span className="group-count">{members.length}</span>
              <div className="group-actions">
                <button className="btn-ghost" onClick={() => startRename(g)}>✎</button>
                <button className="btn-ghost danger" onClick={() => {
                  if (confirm(`Удалить группу «${g.name}»? Торговцы останутся.`)) onDeleteGroup(g.id)
                }}>✕</button>
              </div>
            </div>
            {!isCollapsed && (
              <ul className="merchant-list">
                {members.length === 0 && <li className="empty-hint small">Группа пуста</li>}
                {members.map(m => <MerchantRow key={m.id} merchant={m} onSelect={onSelect} onEdit={onEdit} />)}
              </ul>
            )}
          </div>
        )
      })}

      {/* Без группы */}
      {ungrouped.length > 0 && (
        <div className="group-block">
          {groups.length > 0 && <div className="group-header"><span className="group-name dim">Без группы</span></div>}
          <ul className="merchant-list">
            {ungrouped.map(m => <MerchantRow key={m.id} merchant={m} onSelect={onSelect} onEdit={onEdit} />)}
          </ul>
        </div>
      )}

      {merchants.length === 0 && groups.length === 0 && (
        <p className="empty-hint">Торговцев пока нет. Создайте первого!</p>
      )}

      {/* Создать группу */}
      <div className="new-group-row">
        <input
          placeholder="Название новой группы..."
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
        />
        <button className="btn-secondary" onClick={handleCreateGroup}>+ Группа</button>
      </div>
    </div>
  )
}

function MerchantRow({ merchant, onSelect, onEdit }) {
  return (
    <li className="merchant-row">
      <div className="merchant-row-info" onClick={() => onSelect(merchant)}>
        {merchant.photo
          ? <img src={merchant.photo} alt={merchant.name} className="merchant-thumb" />
          : <div className="merchant-thumb placeholder">{merchant.name?.[0] || '?'}</div>
        }
        <div className="merchant-row-text">
          <span className="merchant-name">{merchant.name}</span>
          {merchant.race && <span className="merchant-race">{merchant.race}</span>}
        </div>
        <span className="merchant-item-count">{merchant.items?.length || 0} тов.</span>
      </div>
      <button className="btn-secondary small" onClick={() => onEdit(merchant)}>Изменить</button>
    </li>
  )
}
