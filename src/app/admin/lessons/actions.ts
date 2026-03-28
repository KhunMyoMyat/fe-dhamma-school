'use server'

import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function getYoutubeMetadata(url: string) {
  try {
    const response = await fetch(`${API_URL}/lessons/youtube/metadata?url=${encodeURIComponent(url)}`, { cache: 'no-store' });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || 'Failed to fetch metadata' };
    }
    const data = await response.json();
    return { success: true, metadata: data, videoId: data.videoId };
  } catch (error) {
    return { success: false, error: 'Failed to connect to API' };
  }
}

export async function createLesson(data: {
  title: string
  description?: string
  youtubeId: string
  category: string
  published?: boolean
}) {
  try {
    const response = await fetch(`${API_URL}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create lesson')
    const lesson = await response.json()

    revalidatePath('/admin/lessons')
    revalidatePath('/lessons')
    return { success: true, lesson }
  } catch (error) {
    console.error('Failed to create lesson:', error)
    return { success: false, error: 'Failed to create lesson' }
  }
}

export async function updateLesson(id: string, data: {
  title?: string
  description?: string
  youtubeId?: string
  category?: string
  published?: boolean
}) {
  try {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update lesson')
    const lesson = await response.json()

    revalidatePath('/admin/lessons')
    revalidatePath('/lessons')
    return { success: true, lesson }
  } catch (error) {
    console.error('Failed to update lesson:', error)
    return { success: false, error: 'Failed to update lesson' }
  }
}

export async function deleteLesson(id: string) {
  try {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete lesson')
    
    revalidatePath('/admin/lessons')
    revalidatePath('/lessons')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete lesson:', error)
    return { success: false, error: 'Failed to delete lesson' }
  }
}
