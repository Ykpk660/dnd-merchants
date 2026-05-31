export default function MerchantView({ merchant, onBack, onItemClick, onEdit }) {
  const items = merchant.items || []
  const left = items.filter((_, i) => i % 2 === 0)
  const right = items.filter((_, i) => i % 2 !== 0)

  return (
    <div className="screen merchant-screen">
      <div className="merchant-topbar">
        <button className="btn-back" onClick={onBack}>← Назад</button>
        <button className="btn-secondary" onClick={onEdit}>Изменить</button>
      </div>

      <h2 className="merchant-title">{merchant.name}</h2>
      {merchant.race && <p className="merchant-subtitle">{merchant.race}</p>}

      <div className="merchant-layout">
        <div className="items-column left">
          {left.map(item => (
            <button key={item.id} className="item-btn" onClick={() => onItemClick(item)}>
              {item.name}
            </button>
          ))}
        </div>

        <div className="merchant-photo-wrap">
          {merchant.photo
            ? <img src={merchant.photo} alt={merchant.name} className="merchant-photo" />
            : <div className="merchant-photo placeholder">?</div>
          }
        </div>

        <div className="items-column right">
          {right.map(item => (
            <button key={item.id} className="item-btn" onClick={() => onItemClick(item)}>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <p className="empty-hint">У торговца пока нет товаров. Нажмите «Изменить».</p>
      )}
    </div>
  )
}
