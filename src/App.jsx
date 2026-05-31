import { useState } from 'react'
import MerchantList from './components/MerchantList'
import MerchantView from './components/MerchantView'
import ItemCard from './components/ItemCard'
import MerchantForm from './components/MerchantForm'
import './App.css'

export default function App() {
  const [merchants, setMerchants] = useState([])
  const [screen, setScreen] = useState('list')
  const [selectedMerchant, setSelectedMerchant] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingMerchant, setEditingMerchant] = useState(null)

  function openMerchant(merchant) {
    setSelectedMerchant(merchant)
    setScreen('merchant')
  }

  function openItem(item) {
    setSelectedItem(item)
    setScreen('item')
  }

  function openCreateForm() {
    setEditingMerchant(null)
    setScreen('form')
  }

  function openEditForm(merchant) {
    setEditingMerchant(merchant)
    setScreen('form')
  }

  function saveMerchant(data) {
    if (editingMerchant) {
      const updated = { ...data, id: editingMerchant.id }
      setMerchants(prev => prev.map(m => m.id === editingMerchant.id ? updated : m))
      setSelectedMerchant(updated)
      setScreen('merchant')
    } else {
      setMerchants(prev => [...prev, { ...data, id: Date.now() }])
      setScreen('list')
    }
  }

  function deleteMerchant(id) {
    setMerchants(prev => prev.filter(m => m.id !== id))
    setScreen('list')
  }

  return (
    <div className="app">
      {screen === 'list' && (
        <MerchantList
          merchants={merchants}
          onSelect={openMerchant}
          onCreate={openCreateForm}
          onEdit={openEditForm}
        />
      )}
      {screen === 'merchant' && selectedMerchant && (
        <MerchantView
          merchant={merchants.find(m => m.id === selectedMerchant.id) || selectedMerchant}
          onBack={() => setScreen('list')}
          onItemClick={openItem}
          onEdit={() => openEditForm(merchants.find(m => m.id === selectedMerchant.id) || selectedMerchant)}
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
          onSave={saveMerchant}
          onDelete={editingMerchant ? () => deleteMerchant(editingMerchant.id) : null}
          onCancel={() => setScreen(editingMerchant ? 'merchant' : 'list')}
        />
      )}
    </div>
  )
}
