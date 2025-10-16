import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

/**
 * Sistema de encriptación AES-256-GCM para mensajes de chat
 */

// Constantes de configuración
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits para GCM (estándar recomendado)
const TAG_LENGTH = 16; // 128 bits para GCM (tag de autenticación)
const KEY_LENGTH = 32; // 256 bits para AES-256

/**
 * Obtiene la clave de encriptación desde las variables de entorno
 * La clave debe ser una cadena hexadecimal de 64 caracteres (32 bytes)
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  
  if (!keyHex) {
    throw new Error('ENCRYPTION_KEY no está definida en las variables de entorno');
  }
  
  if (keyHex.length !== KEY_LENGTH * 2) {
    throw new Error(`ENCRYPTION_KEY debe tener exactamente ${KEY_LENGTH * 2} caracteres hexadecimales`);
  }
  
  try {
    return Buffer.from(keyHex, 'hex');
  } catch (error) {
    throw new Error('ENCRYPTION_KEY debe ser una cadena hexadecimal válida');
  }
}

/**
 * Genera una clave de encriptación aleatoria (solo para setup inicial)
 * Ejecuta esta función una vez y guarda el resultado en tu .env
 */
export function generateEncryptionKey(): string {
  const key = randomBytes(KEY_LENGTH);
  return key.toString('hex');
}

/**
 * Encripta un mensaje usando AES-256-GCM
 * @param message - El mensaje de texto plano a encriptar
 * @returns El mensaje encriptado en formato: iv:encryptedData:authTag (todo en hex)
 */
export function encryptMessage(message: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    
    // Crear cipher AES-256-GCM
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Obtener el tag de autenticación GCM
    const authTag = cipher.getAuthTag();
    
    // Formato: iv:encryptedData:authTag (todo en hexadecimal)
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('Error al encriptar mensaje:', error);
    throw new Error('Error en el proceso de encriptación');
  }
}

/**
 * Desencripta un mensaje usando AES-256-GCM
 * @param encryptedMessage - El mensaje encriptado en formato: iv:encryptedData:authTag
 * @returns El mensaje de texto plano original
 */
export function decryptMessage(encryptedMessage: string): string {
  try {
    const key = getEncryptionKey();
    
    // Parsear el formato iv:encryptedData:authTag
    const parts = encryptedMessage.split(':');
    if (parts.length !== 3) {
      throw new Error('Formato de mensaje encriptado inválido');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');
    
    // Validar longitudes
    if (iv.length !== IV_LENGTH) {
      throw new Error('IV tiene longitud incorrecta');
    }
    if (authTag.length !== TAG_LENGTH) {
      throw new Error('AuthTag tiene longitud incorrecta');
    }
    
    // Crear decipher AES-256-GCM
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error al desencriptar mensaje:', error);
    throw new Error('Error en el proceso de desencriptación');
  }
}

/**
 * Verifica si un mensaje está encriptado
 * @param message - El mensaje a verificar
 * @returns true si el mensaje parece estar encriptado
 */
export function isMessageEncrypted(message: string): boolean {
  // Verificar el formato iv:encryptedData:authTag
  const parts = message.split(':');
  if (parts.length !== 3) {
    return false;
  }
  
  // Verificar que todas las partes sean hexadecimales válidas
  const hexRegex = /^[0-9a-f]+$/i;
  return parts.every(part => hexRegex.test(part) && part.length > 0);
}

/**
 * Encripta un mensaje de forma segura, manejando errores
 * @param message - El mensaje a encriptar
 * @returns El mensaje encriptado o el mensaje original si falla
 */
export function safeEncryptMessage(message: string): string {
  try {
    // Advertir si se intenta encriptar un string vacío
    if (message === '') {
      console.warn('⚠️ [ENCRYPT WARNING] Intentando encriptar un string vacío');
    }
    
    const encrypted = encryptMessage(message);
    
    // Verificar si el resultado tiene el patrón :: (indica contenido vacío)
    if (encrypted.includes('::')) {
      console.warn('⚠️ [ENCRYPT PATTERN] Patrón :: detectado en encriptación', {
        originalLength: message.length,
        encryptedLength: encrypted.length,
        encrypted: encrypted
      });
    }
    
    return encrypted;
  } catch (error) {
    console.error('❌ [ENCRYPT ERROR] Error en encriptación segura, guardando mensaje sin encriptar:', error);
    // En producción, podrías querer lanzar el error en lugar de devolver el mensaje sin encriptar
    return message;
  }
}

/**
 * Desencripta un mensaje de forma segura, manejando errores
 * @param encryptedMessage - El mensaje encriptado
 * @returns El mensaje desencriptado o el mensaje original si no está encriptado o falla
 */
export function safeDecryptMessage(encryptedMessage: string): string {
  // Si el mensaje no parece estar encriptado, devolverlo tal como está
  if (!isMessageEncrypted(encryptedMessage)) {
    return encryptedMessage;
  }
  
  try {
    const decrypted = decryptMessage(encryptedMessage);
    
    // Advertir si el resultado de desencriptación está vacío
    if (decrypted === '') {
      console.warn('⚠️ [DECRYPT WARNING] Desencriptación resultó en string vacío', {
        encryptedMessage: encryptedMessage,
        hasDoubleColon: encryptedMessage.includes('::')
      });
    }
    
    return decrypted;
  } catch (error) {
    console.error('❌ [DECRYPT ERROR] Error en desencriptación segura, devolviendo mensaje encriptado:', error);
    console.error('❌ [DECRYPT ERROR] Mensaje que falló:', encryptedMessage);
    // En caso de error, devolver el mensaje encriptado para debugging
    return encryptedMessage;
  }
}

// Utilidades para debugging y testing
export const CryptoUtils = {
  ALGORITHM,
  IV_LENGTH,
  TAG_LENGTH,
  KEY_LENGTH,
  generateKey: generateEncryptionKey,
  encrypt: encryptMessage,
  decrypt: decryptMessage,
  safeEncrypt: safeEncryptMessage,
  safeDecrypt: safeDecryptMessage,
  isEncrypted: isMessageEncrypted,
};
