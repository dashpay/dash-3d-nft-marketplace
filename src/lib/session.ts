interface SessionData {
  identityId: string;
  username?: string;
  network: 'mainnet' | 'testnet';
  timestamp: number;
  expiresAt: number;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_STORAGE_KEY = 'dash-nft-session';

export class SessionManager {
  private static instance: SessionManager;
  private sessionData: SessionData | null = null;
  private listeners: Array<(session: SessionData | null) => void> = [];

  private constructor() {
    this.loadSession();
    this.setupStorageListener();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private loadSession(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as SessionData;
        
        // Check if session is still valid
        if (Date.now() < data.expiresAt) {
          this.sessionData = data;
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  private saveSession(): void {
    if (typeof window === 'undefined') return;

    try {
      if (this.sessionData) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.sessionData));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  private setupStorageListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      if (event.key === SESSION_STORAGE_KEY) {
        this.loadSession();
        this.notifyListeners();
      }
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.sessionData));
  }

  createSession(identityId: string, network: 'mainnet' | 'testnet', username?: string): void {
    const now = Date.now();
    this.sessionData = {
      identityId,
      network,
      username,
      timestamp: now,
      expiresAt: now + SESSION_DURATION
    };
    
    this.saveSession();
    this.notifyListeners();
  }

  updateSession(updates: Partial<Pick<SessionData, 'username'>>): void {
    if (this.sessionData) {
      this.sessionData = {
        ...this.sessionData,
        ...updates
      };
      this.saveSession();
      this.notifyListeners();
    }
  }

  clearSession(): void {
    this.sessionData = null;
    this.saveSession();
    this.notifyListeners();
  }

  getSession(): SessionData | null {
    return this.sessionData;
  }

  isSessionValid(): boolean {
    return this.sessionData !== null && Date.now() < this.sessionData.expiresAt;
  }

  getTimeUntilExpiry(): number {
    if (!this.sessionData) return 0;
    return Math.max(0, this.sessionData.expiresAt - Date.now());
  }

  refreshSession(): void {
    if (this.sessionData) {
      this.sessionData.expiresAt = Date.now() + SESSION_DURATION;
      this.saveSession();
      this.notifyListeners();
    }
  }

  onSessionChange(listener: (session: SessionData | null) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const sessionManager = SessionManager.getInstance();