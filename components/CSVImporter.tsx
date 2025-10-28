'use client';

import React, { useState, useRef } from 'react';

interface ImportResult {
  line: number;
  success?: boolean;
  id?: string;
  name?: string;
  error?: string;
  data?: any;
}

interface ImportResponse {
  success: boolean;
  message: string;
  data: {
    created: ImportResult[];
    errors: ImportResult[];
    summary: {
      total: number;
      success: number;
      failed: number;
    };
  };
}

interface CSVImporterProps {
  type: 'establishments' | 'sites';
  apiEndpoint: string;
  token?: string;
  onImportComplete?: (result: ImportResponse) => void;
}

export default function CSVImporter({ type, apiEndpoint, token, onImportComplete }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templateUrl = type === 'establishments' 
    ? '/templates/establishments-template.csv'
    : '/templates/sites-template.csv';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Veuillez sélectionner un fichier CSV valide');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data: ImportResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'importation');
      }

      setResult(data);
      if (onImportComplete) {
        onImportComplete(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = `${type}-template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Import CSV - {type === 'establishments' ? 'Établissements' : 'Sites Touristiques'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Importez plusieurs {type === 'establishments' ? 'établissements' : 'sites'} à la fois depuis un fichier CSV
        </p>
      </div>
      <div className="p-6 space-y-4">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <div>
              <p className="font-medium text-sm">Modèle CSV</p>
              <p className="text-xs text-gray-600">
                Téléchargez le modèle pour voir le format requis
              </p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Télécharger
          </button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fichier CSV</label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {file && (
              <button
                onClick={handleReset}
                disabled={importing}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Réinitialiser
              </button>
            )}
          </div>
          {file && (
            <p className="text-sm text-gray-600">
              Fichier sélectionné: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {importing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Importation en cours...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Importer
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <div>
                <h3 className="font-semibold text-red-900">Erreur</h3>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div>
                  <h3 className="font-semibold text-green-900">Import terminé</h3>
                  <p className="text-sm text-green-800 mt-1">{result.message}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{result.data.summary.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{result.data.summary.success}</p>
                <p className="text-sm text-gray-600">Réussis</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{result.data.summary.failed}</p>
                <p className="text-sm text-gray-600">Échoués</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(result.data.summary.success / result.data.summary.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 text-center mt-1">
                {Math.round((result.data.summary.success / result.data.summary.total) * 100)}% réussi
              </p>
            </div>

            {/* Success List */}
            {result.data.created.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Entrées créées ({result.data.created.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-green-50 rounded-lg">
                  {result.data.created.map((item, idx) => (
                    <div key={idx} className="text-sm flex justify-between items-center">
                      <span className="truncate text-gray-900">{item.name}</span>
                      <span className="text-xs text-gray-600">Ligne {item.line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors List */}
            {result.data.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Erreurs ({result.data.errors.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-red-50 rounded-lg">
                  {result.data.errors.map((item, idx) => (
                    <div key={idx} className="text-sm p-2 bg-white rounded border border-red-200">
                      <p className="font-medium text-red-600">Ligne {item.line}</p>
                      <p className="text-xs text-gray-600">{item.error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
