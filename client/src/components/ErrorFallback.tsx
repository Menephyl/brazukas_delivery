/**
 * Brazukas Delivery - ErrorFallback Component
 * Componente para exibir erros com opção de retry
 */

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export default function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center animate-fade-in">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-destructive">Algo deu errado</h1>
        <p className="text-muted-foreground mb-4">
          Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition">
            Detalhes do erro
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs text-muted-foreground">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetError}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
