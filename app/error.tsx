"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Ocorreu um erro inesperado</h2>
      <p className="mb-6">{error?.message || 'Algo deu errado. Tente novamente.'}</p>
      <button
        className="btn-primary px-6 py-2 rounded"
        onClick={() => reset()}
      >
        Tentar novamente
      </button>
    </div>
  );
} 