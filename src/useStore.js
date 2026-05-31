import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useStore() {
  const [groups, setGroups] = useState([])
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Загрузка данных при старте
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [{ data: g, error: ge }, { data: m, error: me }] = await Promise.all([
          supabase.from('groups').select('*').order('created_at'),
          supabase.from('merchants').select('*').order('created_at'),
        ])
        if (ge) throw ge
        if (me) throw me
        setGroups(g || [])
        setMerchants((m || []).map(row => ({
          ...row,
          groupId: row.group_id,
          items: row.items || [],
        })))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  async function createGroup(name) {
    const { data, error } = await supabase.from('groups').insert({ name }).select().single()
    if (error) { alert('Ошибка: ' + error.message); return }
    setGroups(prev => [...prev, data])
    return data
  }

  async function renameGroup(id, name) {
    const { error } = await supabase.from('groups').update({ name }).eq('id', id)
    if (error) { alert('Ошибка: ' + error.message); return }
    setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g))
  }

  async function deleteGroup(id) {
    const { error } = await supabase.from('groups').delete().eq('id', id)
    if (error) { alert('Ошибка: ' + error.message); return }
    setGroups(prev => prev.filter(g => g.id !== id))
    setMerchants(prev => prev.map(m => m.groupId === id ? { ...m, groupId: null } : m))
  }

  async function saveMerchant(data, existingId) {
    const row = {
      name: data.name,
      race: data.race,
      photo: data.photo,
      group_id: data.groupId || null,
      items: data.items || [],
    }

    if (existingId) {
      const { error } = await supabase.from('merchants').update(row).eq('id', existingId)
      if (error) { alert('Ошибка: ' + error.message); return existingId }
      setMerchants(prev => prev.map(m => m.id === existingId
        ? { ...m, ...data, id: existingId, groupId: data.groupId || null }
        : m
      ))
      return existingId
    } else {
      const { data: created, error } = await supabase.from('merchants').insert(row).select().single()
      if (error) { alert('Ошибка: ' + error.message); return null }
      const merchant = { ...created, groupId: created.group_id, items: created.items || [] }
      setMerchants(prev => [...prev, merchant])
      return created.id
    }
  }

  async function deleteMerchant(id) {
    const { error } = await supabase.from('merchants').delete().eq('id', id)
    if (error) { alert('Ошибка: ' + error.message); return }
    setMerchants(prev => prev.filter(m => m.id !== id))
  }

  return { groups, merchants, loading, error, createGroup, renameGroup, deleteGroup, saveMerchant, deleteMerchant }
}
