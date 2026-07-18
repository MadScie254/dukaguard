import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useStore } from '../lib/store';
import { Cloud, CloudOff, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function SyncIndicator() {
  const { isOnline } = useApp();
  const { syncStatus } = useStore();
  const { translate } = useApp();

  if (!isOnline) {
    return (
      <div className="sync-indicator offline">
        <CloudOff className="h-3.5 w-3.5" />
        <span>{translate('offline.title')}</span>
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className="sync-indicator syncing">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        <span>Syncing...</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div className="sync-indicator error">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Sync failed</span>
      </div>
    );
  }

  if (syncStatus === 'success') {
    return (
      <div className="sync-indicator success">
        <CheckCircle className="h-3.5 w-3.5" />
        <span>{translate('offline.synced')}</span>
      </div>
    );
  }

  return null;
}
