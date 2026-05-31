import { useState } from 'react'
import { useStore } from './useStore'
import MerchantList from './components/MerchantList'
import MerchantView from './components/MerchantView'
import ItemCard from './components/ItemCard'
import MerchantForm from './components/MerchantForm'
import './App.css'

export default function App() {
  const store = useStore()
  const [screen, setScreen] = useState('list')
  const [selectedMerchantId, setSelectedMerchantId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingMerchantId, setEditingMerchantId] = useState(null)

  if (store.loading) return <div className="app-loading">Загрузка...</div>
  if (store.error) return <div className="app-loading error">Ошибка подключения к БД: {store.error}</div>

  const selectedMerchant = store.merchants.find(m => m.id === selectedMerchantId)
  const editingMerchant = store.merchants.find(m => m.id === editingMerchantId) || null

  function openMerchant(merchant) {
    setSelectedMerchantId(merchant.id)
    setScreen('merchant')
  }

  function openItem(item) {
    setSelectedItem(item)
    setScreen('item')
  }

  function openCreateForm() {
    setEditingMerchantId(null)
    setScreen('form')
  }

  function openEditForm(merchant) {
    setEditingMerchantId(merchant.id)
    setScreen('form')
  }

  function handleSave(data) {
    const id = store.saveMerchant(data, editingMerchantId)
    if (editingMerchantId) {
      setScreen('merchant')
    } else {
      setSelectedMerchantId(id)
      setScreen('list')
    }
  }

  function handleDelete(id) {
    store.deleteMerchant(id)
    setScreen('list')
  }

  return (
    <div className="app">
      {screen === 'list' && (
        <MerchantList
          merchants={store.merchants}
          groups={store.groups}
          onSelect={openMerchant}
          onCreate={openCreateForm}
          onEdit={openEditForm}
          onCreateGroup={store.createGroup}
          onRenameGroup={store.renameGroup}
          onDeleteGroup={store.deleteGroup}
        />
      )}
      {screen === 'merchant' && selectedMerchant && (
        <MerchantView
          merchant={selectedMerchant}
          onBack={() => setScreen('list')}
          onItemClick={openItem}
          onEdit={() => openEditForm(selectedMerchant)}
        />
      )}
      {screen === 'item' && selectedItem && (
        <ItemCard
          item={selectedItem}
          onBack={() => setScreen('merchant')}
        />
      )}
      {screen === 'form' && (
        <MerchantForm
          merchant={editingMerchant}
          groups={store.groups}
          onSave={handleSave}
          onDelete={editingMerchantId ? () => handleDelete(editingMerchantId) : null}
          onCancel={() => setScreen(editingMerchantId ? 'merchant' : 'list')}
        />
      )}
    </div>
  )
}
