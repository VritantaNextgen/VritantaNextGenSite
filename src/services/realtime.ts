// Simple realtime service using localStorage for cross-tab communication

type MessageHandler = (message: any) => void;
type PresenceHandler = (users: any[]) => void;

interface ChannelSubscription {
  userId: string;
  metadata: Record<string, any>;
}

interface PresenceUser {
  userId: string;
  metadata: Record<string, any>;
  lastSeen: string;
}

class RealtimeChannel {
  private channelName: string;
  private messageHandlers: MessageHandler[] = [];
  private presenceHandlers: PresenceHandler[] = [];
  private userId: string | null = null;
  private metadata: Record<string, any> | null = null;
  private heartbeatInterval: number | null = null;

  constructor(channelName: string) {
    this.channelName = channelName;
    
    // Listen for storage events for cross-tab communication
    window.addEventListener('storage', this.handleStorageEvent);
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (!event.key) return;
    
    // Handle messages
    if (event.key === `rt_msg_${this.channelName}`) {
      try {
        const message = JSON.parse(event.newValue || '{}');
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Error parsing realtime message:', error);
      }
    }
    
    // Handle presence updates
    if (event.key === `rt_presence_${this.channelName}`) {
      this.notifyPresenceHandlers();
    }
  };

  private getPresenceUsers(): PresenceUser[] {
    try {
      const data = localStorage.getItem(`rt_presence_${this.channelName}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting presence users:', error);
      return [];
    }
  }

  private updatePresence() {
    if (!this.userId) return;
    
    const users = this.getPresenceUsers();
    const now = new Date().toISOString();
    
    // Remove expired users (inactive for more than 30 seconds)
    const activeUsers = users.filter(user => {
      const lastSeen = new Date(user.lastSeen);
      const diffSeconds = (new Date().getTime() - lastSeen.getTime()) / 1000;
      return diffSeconds < 30;
    });
    
    // Update or add current user
    const existingIndex = activeUsers.findIndex(u => u.userId === this.userId);
    if (existingIndex >= 0) {
      activeUsers[existingIndex].lastSeen = now;
    } else if (this.metadata) {
      activeUsers.push({
        userId: this.userId,
        metadata: this.metadata,
        lastSeen: now
      });
    }
    
    // Save updated presence
    localStorage.setItem(`rt_presence_${this.channelName}`, JSON.stringify(activeUsers));
    
    // Notify handlers
    this.notifyPresenceHandlers();
  }

  private notifyPresenceHandlers() {
    const users = this.getPresenceUsers();
    this.presenceHandlers.forEach(handler => handler(users));
  }

  async subscribe({ userId, metadata }: ChannelSubscription) {
    this.userId = userId;
    this.metadata = metadata;
    
    // Start heartbeat for presence
    this.heartbeatInterval = window.setInterval(() => {
      this.updatePresence();
    }, 5000) as unknown as number;
    
    // Initial presence update
    this.updatePresence();
    
    return true;
  }

  async unsubscribe() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Remove from presence
    if (this.userId) {
      const users = this.getPresenceUsers();
      const filtered = users.filter(u => u.userId !== this.userId);
      localStorage.setItem(`rt_presence_${this.channelName}`, JSON.stringify(filtered));
    }
    
    // Remove event listener
    window.removeEventListener('storage', this.handleStorageEvent);
    
    this.userId = null;
    this.metadata = null;
    this.messageHandlers = [];
    this.presenceHandlers = [];
    
    return true;
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onPresence(handler: PresenceHandler) {
    this.presenceHandlers.push(handler);
    // Initial notification
    handler(this.getPresenceUsers());
    return () => {
      this.presenceHandlers = this.presenceHandlers.filter(h => h !== handler);
    };
  }

  async publish(message: any) {
    const messageWithMeta = {
      ...message,
      sender: this.userId,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage to trigger storage event in other tabs
    localStorage.setItem(`rt_msg_${this.channelName}`, JSON.stringify(messageWithMeta));
    
    // Also notify handlers in current tab
    this.messageHandlers.forEach(handler => handler(messageWithMeta));
    
    return true;
  }
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  channel(name: string) {
    if (!this.channels.has(name)) {
      this.channels.set(name, new RealtimeChannel(name));
    }
    return this.channels.get(name)!;
  }
}

const realtime = new RealtimeService();
export default realtime;