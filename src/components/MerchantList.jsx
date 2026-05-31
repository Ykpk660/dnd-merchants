export default function MerchantList({ merchants, onSelect, onCreate, onEdit }) {
  return (
    <div className="screen list-screen">
      <div className="list-header">
        <h1>Торговцы</h1>
        <button className="btn-primary" onClick={onCreate}>+ Создать торговца</button>
      </div>

      {merchants.length === 0 && (
        <p className="empty-hint">Торговцев пока нет. Создайте первого!</p>
      )}

      <ul className="merchant-list">
        {merchants.map(m => (
          <li key={m.id} className="merchant-row">
            <div className="merchant-row-info" onClick={() => onSelect(m)}>
              {m.photo
                ? <img src={m.photo} alt={m.name} className="merchant-thumb" />
                : <div className="merchant-thumb placeholder">?</div>
              }
              <span className="merchant-name">{m.name}</span>
              {m.race && <span className="merchant-race">{m.race}</span>}
            </div>
            <button className="btn-secondary" onClick={() => onEdit(m)}>Изменить</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
