type StorageKind = 'local' | 'session';

function getStore(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage(kind: StorageKind, key: string): string | null {
  try {
    return getStore(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(kind: StorageKind, key: string, value: string): void {
  try {
    getStore(kind)?.setItem(key, value);
  } catch {
    // Almacenamiento bloqueado (modo privado, permisos): se ignora.
  }
}
