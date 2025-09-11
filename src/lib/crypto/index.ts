/**
 * Sistema de encriptación AES-256-GCM para mensajes de chat
 * Este módulo proporciona encriptación simétrica para los mensajes del chatbot,
 * compatible tanto con Node.js como con Python.
 */

export {
  encryptMessage,
  decryptMessage,
  safeEncryptMessage,
  safeDecryptMessage,
  isMessageEncrypted,
  generateEncryptionKey,
  CryptoUtils,
} from './encryption';

export { runTests as runEncryptionTests } from './test-encryption';

// Re-exportar tipos útiles si los necesitas
export type EncryptionResult = string;
export type DecryptionResult = string;
