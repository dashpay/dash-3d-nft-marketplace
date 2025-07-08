'use client';

import { useEffect, useState, useRef } from 'react';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  details?: any;
}

// Global log storage
const globalLogs: LogEntry[] = [];
const logListeners: Set<(logs: LogEntry[]) => void> = new Set();

// Override console methods
if (typeof window !== 'undefined') {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
  };

  const addLog = (level: LogEntry['level'], args: any[]) => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '),
      details: args.length > 1 ? args.slice(1) : undefined
    };
    
    globalLogs.push(entry);
    
    // Keep only last 100 entries
    if (globalLogs.length > 100) {
      globalLogs.shift();
    }
    
    // Notify listeners asynchronously to avoid setState during render
    setTimeout(() => {
      logListeners.forEach(listener => listener([...globalLogs]));
    }, 0);
    
    // Call original console method
    originalConsole[level === 'info' ? 'log' : level](...args);
  };

  console.log = (...args: any[]) => addLog('info', args);
  console.error = (...args: any[]) => addLog('error', args);
  console.warn = (...args: any[]) => addLog('warn', args);
  console.debug = (...args: any[]) => addLog('debug', args);
}

export default function LogView() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial logs
    setLogs([...globalLogs]);
    
    // Subscribe to log updates
    const listener = (newLogs: LogEntry[]) => {
      setLogs(newLogs);
    };
    
    logListeners.add(listener);
    
    return () => {
      logListeners.delete(listener);
    };
  }, []);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const clearLogs = () => {
    globalLogs.length = 0;
    setLogs([]);
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'debug': return 'text-gray-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full bg-gray-900 border-l border-gray-700 transition-all duration-300 ${
      isMinimized ? 'w-12' : 'w-96'
    } z-50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        {!isMinimized && (
          <>
            <h3 className="text-sm font-semibold text-gray-300">Console Logs</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearLogs}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                Clear
              </button>
              <span className="text-xs text-gray-500">{logs.length} entries</span>
            </div>
          </>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMinimized ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>
      </div>

      {/* Logs */}
      {!isMinimized && (
        <div className="h-full overflow-y-auto pb-16">
          <div className="p-2 space-y-1">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No logs yet
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="font-mono text-xs p-2 bg-gray-800 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 whitespace-nowrap">
                      {log.timestamp.toTimeString().split(' ')[0]}
                    </span>
                    <span className={`font-semibold uppercase ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-300 break-all whitespace-pre-wrap">
                    {log.message}
                  </div>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}