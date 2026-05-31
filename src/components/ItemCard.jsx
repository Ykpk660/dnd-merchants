export default function ItemCard({ item, onBack }) {
  return (
    <div className="screen item-screen">
      <button className="btn-back" onClick={onBack}>← Назад</button>

      <div className="item-card">
        <h2 className="item-name">{item.name}</h2>
        {item.type && <p className="item-type">{item.type}</p>}
        {item.description && <p className="item-description">{item.description}</p>}
        <div className="item-price-wrap">
          <span className="item-price-label">Цена:</span>
          <span className="item-price">{item.price || '—'}</span>
        </div>
      </div>
    </div>
  )
}
