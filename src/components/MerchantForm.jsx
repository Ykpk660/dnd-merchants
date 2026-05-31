import { useState, useRef } from 'react'

function emptyItem() {
  return { id: Date.now() + Math.random(), name: '', type: '', description: '', price: '' }
}

export default function MerchantForm({ merchant, groups, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(merchant?.name || '')
  const [race, setRace] = useState(merchant?.race || '')
  const [photo, setPhoto] = useState(merchant?.photo || null)
  const [groupId, setGroupId] = useState(merchant?.groupId || '')
  const [items, setItems] = useState(merchant?.items?.map(i => ({ ...i })) || [])
  const fileRef = useRef()

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  function addItem() {
    setItems(prev => [...prev, emptyItem()])
  }

  function updateItem(id, field, value) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function handleSave() {
    if (!name.trim()) return alert('Введите имя торговца')
    onSave({
      name: name.trim(),
      race: race.trim(),
      photo,
      groupId: groupId || null,
      items
    })
  }

  return (
    <div className="screen form-screen">
      <div className="form-topbar">
        <button className="btn-back" onClick={onCancel}>← Отмена</button>
        {onDelete && (
          <button className="btn-danger" onClick={() => { if (confirm('Удалить торговца?')) onDelete() }}>
            Удалить
          </button>
        )}
      </div>

      <h2>{merchant ? 'Изменить торговца' : 'Новый торговец'}</h2>

      <div className="form-group">
        <label>Имя</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя торговца" />
      </div>

      <div className="form-group">
        <label>Раса / Описание</label>
        <input value={race} onChange={e => setRace(e.target.value)} placeholder="Человек, эльф..." />
      </div>

      {groups.length > 0 && (
        <div className="form-group">
          <label>Группа</label>
          <select value={groupId} onChange={e => setGroupId(e.target.value)}>
            <option value="">— Без группы —</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Фото</label>
        <div className="photo-row">
          {photo
            ? <img src={photo} alt="preview" className="photo-preview" />
            : <div className="photo-preview placeholder">{name?.[0] || '?'}</div>
          }
          <button className="btn-secondary" onClick={() => fileRef.current.click()}>
            {photo ? 'Сменить' : 'Загрузить фото'}
          </button>
          {photo && <button className="btn-secondary" onClick={() => setPhoto(null)}>Убрать</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <h3>Товары</h3>
          <button className="btn-secondary small" onClick={addItem}>+ Товар</button>
        </div>

        {items.length === 0 && <p className="empty-hint small">Товаров нет</p>}

        {items.map((item, idx) => (
          <div key={item.id} className="item-form-row">
            <div className="item-form-index">#{idx + 1}</div>
            <div className="item-form-fields">
              <input
                placeholder="Название товара"
                value={item.name}
                onChange={e => updateItem(item.id, 'name', e.target.value)}
              />
              <div className="item-form-row2">
                <input
                  placeholder="Тип (меч, зелье...)"
                  value={item.type}
                  onChange={e => updateItem(item.id, 'type', e.target.value)}
                />
                <input
                  placeholder="Цена (100 зм)"
                  value={item.price}
                  onChange={e => updateItem(item.id, 'price', e.target.value)}
                />
              </div>
              <textarea
                placeholder="Описание"
                value={item.description}
                onChange={e => updateItem(item.id, 'description', e.target.value)}
                rows={2}
              />
            </div>
            <button className="btn-remove" onClick={() => removeItem(item.id)}>✕</button>
          </div>
        ))}
      </div>

      <button className="btn-primary btn-save" onClick={handleSave}>
        {merchant ? 'Сохранить' : 'Создать'}
      </button>
    </div>
  )
}
