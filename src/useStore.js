import { useState, useEffect } from 'react'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useStore() {
  const [groups, setGroups] = useState(() => load('dnd_groups', []))
  const [merchants, setMerchants] = useState(() => load('dnd_merchants', []))

  useEffect(() => { localStorage.setItem('dnd_groups', JSON.stringify(groups)) }, [groups])
  useEffect(() => { localStorage.setItem('dnd_merchants', JSON.stringify(merchants)) }, [merchants])

  function createGroup(name) {
    const g = { id: Date.now(), name }
    setGroups(prev => [...prev, g])
    return g
  }

  function renameGroup(id, name) {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g))
  }

  function deleteGroup(id) {
    setGroups(prev => prev.filter(g => g.id !== id))
    setMerchants(prev => prev.map(m => m.groupId === id ? { ...m, groupId: null } : m))
  }

  function saveMerchant(data, existingId) {
    if (existingId) {
      setMerchants(prev => prev.map(m => m.id === existingId ? { ...data, id: existingId } : m))
      return existingId
    } else {
      const id = Date.now()
      setMerchants(prev => [...prev, { ...data, id }])
      return id
    }
  }

  function deleteMerchant(id) {
    setMerchants(prev => prev.filter(m => m.id !== id))
  }

  return { groups, merchants, createGroup, renameGroup, deleteGroup, saveMerchant, deleteMerchant }
}
