import { useState, useEffect, useCallback } from 'react'
import blink from '../blink/client'
import { useAuth } from './useAuth'

interface RealtimeHookOptions {
  channel: string
  onMessage?: (message: any) => void
  onPresence?: (users: any[]) => void
}

export function useRealtime({ channel, onMessage, onPresence }: RealtimeHookOptions) {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    let realtimeChannel: any = null
    let unsubscribeMessage: (() => void) | null = null
    let unsubscribePresence: (() => void) | null = null

    const initRealtime = async () => {
      try {
        realtimeChannel = blink.realtime.channel(channel)
        
        await realtimeChannel.subscribe({
          userId: user.id,
          metadata: {
            displayName: user.displayName || user.email.split('@')[0],
            role: user.role,
            avatar: user.avatarUrl
          }
        })

        setIsConnected(true)

        // Listen for messages
        if (onMessage) {
          unsubscribeMessage = realtimeChannel.onMessage((message: any) => {
            onMessage(message)
          })
        }

        // Listen for presence changes
        unsubscribePresence = realtimeChannel.onPresence((users: any[]) => {
          setOnlineUsers(users)
          if (onPresence) {
            onPresence(users)
          }
        })

      } catch (error) {
        console.error('Failed to initialize realtime:', error)
        setIsConnected(false)
      }
    }

    initRealtime()

    return () => {
      if (unsubscribeMessage) unsubscribeMessage()
      if (unsubscribePresence) unsubscribePresence()
      if (realtimeChannel) {
        realtimeChannel.unsubscribe()
      }
      setIsConnected(false)
    }
  }, [user, channel, onMessage, onPresence])

  const publishMessage = useCallback(async (type: string, data: any) => {
    if (!user || !isConnected) return

    try {
      await blink.realtime.publish(channel, type, {
        ...data,
        timestamp: Date.now(),
        userId: user.id,
        userRole: user.role
      })
    } catch (error) {
      console.error('Failed to publish message:', error)
    }
  }, [user, channel, isConnected])

  const broadcastUpdate = useCallback(async (entityType: string, action: string, data: any) => {
    await publishMessage('entity_update', {
      entityType,
      action, // 'create', 'update', 'delete'
      data,
      timestamp: Date.now()
    })
  }, [publishMessage])

  return {
    isConnected,
    onlineUsers,
    publishMessage,
    broadcastUpdate
  }
}

// Hook for real-time blog updates
export function useBlogRealtime() {
  const [posts, setPosts] = useState<any[]>([])
  const { broadcastUpdate } = useRealtime({
    channel: 'blog-updates',
    onMessage: (message) => {
      if (message.type === 'entity_update' && message.data.entityType === 'blog_post') {
        const { action, data } = message.data
        
        setPosts(prevPosts => {
          switch (action) {
            case 'create':
              return [data, ...prevPosts]
            case 'update':
              return prevPosts.map(post => 
                post.id === data.id ? { ...post, ...data } : post
              )
            case 'delete':
              return prevPosts.filter(post => post.id !== data.id)
            default:
              return prevPosts
          }
        })
      }
    }
  })

  const createPost = useCallback(async (postData: any) => {
    try {
      const newPost = await blink.db.blogPosts.create(postData)
      await broadcastUpdate('blog_post', 'create', newPost)
      return newPost
    } catch (error) {
      console.error('Failed to create post:', error)
      throw error
    }
  }, [broadcastUpdate])

  const updatePost = useCallback(async (postId: string, updates: any) => {
    try {
      await blink.db.blogPosts.update(postId, updates)
      const updatedPost = await blink.db.blogPosts.list({
        where: { id: postId },
        limit: 1
      })
      if (updatedPost.length > 0) {
        await broadcastUpdate('blog_post', 'update', updatedPost[0])
      }
      return updatedPost[0]
    } catch (error) {
      console.error('Failed to update post:', error)
      throw error
    }
  }, [broadcastUpdate])

  const deletePost = useCallback(async (postId: string) => {
    try {
      await blink.db.blogPosts.delete(postId)
      await broadcastUpdate('blog_post', 'delete', { id: postId })
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }, [broadcastUpdate])

  return {
    posts,
    setPosts,
    createPost,
    updatePost,
    deletePost
  }
}