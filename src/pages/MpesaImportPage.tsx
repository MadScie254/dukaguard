import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useStore } from '../lib/store';
import { useApp } from '../contexts/AppContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { generateId, getCurrentTimestamp } from '../lib/utils';

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseAmount(raw: string | undefined): number {
  if (!raw) return 0;
  const normalized = raw.replace(/[^0-9.-]+/g, '');
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function parseTimestamp(rawDate: string | undefined, rawTime: string | undefined): string {
  const datePart = rawDate?.trim();
  const timePart = rawTime?.trim();
  if (!datePart && !timePart) return getCurrentTimestamp();

  const merged = [datePart, timePart].filter(Boolean).join(' ');
  const parsed = new Date(merged);
  return Number.isNaN(parsed.getTime()) ? getCurrentTimestamp() : parsed.toISOString();
}

function parseMpesaCsv(text: string) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    throw new Error('CSV file is empty or missing rows');
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const getFieldIndex = (...candidates: string[]) => headers.findIndex(header => candidates.includes(header));

  const transactionIndex = getFieldIndex('transactionid', 'transactionreference', 'reference', 'receiptno', 'receiptnumber', 'id');
  const phoneIndex = getFieldIndex('phonenumber', 'phone', 'senderphone', 'customerphone');
  const amountIndex = getFieldIndex('amount', 'value', 'transactionamount');
  const typeIndex = getFieldIndex('type', 'direction');
  const descriptionIndex = getFieldIndex('description', 'details', 'narration', 'remarks');
  const dateIndex = getFieldIndex('date', 'transactiondate', 'posteddate');
  const timeIndex = getFieldIndex('time', 'transactiontime', 'postedtime');

  return lines.slice(1).map(line => {
    const columns = parseCsvLine(line);
    const transactionId = columns[transactionIndex] || generateId();
    const amount = parseAmount(columns[amountIndex]);
    const typeValue = (columns[typeIndex] || 'incoming').toLowerCase();
    const description = columns[descriptionIndex] || 'M-Pesa statement import';

    return {
      transactionId,
      phoneNumber: columns[phoneIndex] || '',
      amount,
      type: typeValue.includes('out') ? 'outgoing' : 'incoming',
      timestamp: parseTimestamp(columns[dateIndex], columns[timeIndex]),
      description,
    };
  });
}

export default function MpesaImportPage() {
  const navigate = useNavigate();
  const { translate } = useApp();
  const { currentOutlet } = useStore();
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentOutlet) {
      return;
    }

    setError('');
    setStatus('');

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setError('PDF import is not supported yet. Please upload a CSV export for now.');
      return;
    }

    try {
      const csvText = await file.text();
      const entries = parseMpesaCsv(csvText);

      for (const entry of entries) {
        await db.mpesaEntries.add({
          id: generateId(),
          outletId: currentOutlet.id,
          transactionId: entry.transactionId,
          phoneNumber: entry.phoneNumber,
          amount: entry.amount,
          type: entry.type,
          timestamp: entry.timestamp,
          description: entry.description,
          synced: false,
        });
      }

      setStatus(`Imported ${entries.length} statement entr${entries.length === 1 ? 'y' : 'ies'}.`);
      e.target.value = '';
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Failed to import the CSV file.');
    }
  };

  const entries = useLiveQuery(() => db.mpesaEntries.toArray(), []);

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-ghost"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="page-title">{translate('mpesa.import')}</h1>
        <div className="w-10" />
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Upload className="h-8 w-8 text-sky-500" />
          <div>
            <div className="font-semibold text-slate-900">Upload M-Pesa Statement</div>
            <div className="text-sm text-slate-500">CSV or PDF format</div>
          </div>
        </div>
        <label className="btn-secondary w-full cursor-pointer">
          <Upload className="h-4 w-4" /> Choose File
          <input type="file" accept=".csv,.pdf" className="hidden" onChange={handleFileUpload} />
        </label>
        {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {entries && entries.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="section-title">{translate('mpesa.statement')}</div>
          {entries.map(entry => (
            <div key={entry.id} className="card flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${entry.matchedTransactionId ? 'bg-green-100' : 'bg-slate-100'}`}>
                {entry.matchedTransactionId ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">KES {entry.amount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{entry.phoneNumber}</div>
              </div>
              <span className={`badge ${entry.matchedTransactionId ? 'badge-success' : 'badge-warning'}`}>
                {entry.matchedTransactionId ? 'Matched' : 'Unmatched'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
