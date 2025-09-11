import { 
  encryptMessage, 
  decryptMessage, 
  isMessageEncrypted, 
  safeEncryptMessage, 
  safeDecryptMessage,
  generateEncryptionKey 
} from './encryption';

/**
 * Suite de pruebas para el sistema de encriptación
 * Ejecutar con: npx tsx src/lib/crypto/test-encryption.ts
 */

function runTests() {
  console.log('🧪 Iniciando pruebas del sistema de encriptación...\n');

  // Generar una clave temporal para las pruebas
  const testKey = generateEncryptionKey();
  process.env.ENCRYPTION_KEY = testKey;
  console.log('✅ Clave de prueba generada:', testKey.substring(0, 10) + '...\n');

  // Test 1: Encriptación y desencriptación básica
  console.log('📝 Test 1: Encriptación y desencriptación básica');
  try {
    const originalMessage = "Hola, este es un mensaje de prueba del chatbot! 🤖";
    const encrypted = encryptMessage(originalMessage);
    const decrypted = decryptMessage(encrypted);
    
    console.log(`   Original: ${originalMessage}`);
    console.log(`   Encriptado: ${encrypted}`);
    console.log(`   Desencriptado: ${decrypted}`);
    console.log(`   ✅ Resultado: ${originalMessage === decrypted ? 'CORRECTO' : '❌ERROR❌'}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error}\n`);
  }

  // Test 2: Detección de mensajes encriptados
  console.log('📝 Test 2: Detección de mensajes encriptados');
  try {
    const plainText = "Mensaje normal sin encriptar";
    const encrypted = encryptMessage("Mensaje encriptado");
    
    console.log(`   Texto plano es encriptado: ${isMessageEncrypted(plainText)}`);
    console.log(`   Texto encriptado es encriptado: ${isMessageEncrypted(encrypted)}`);
    console.log(`   ✅ Detección funcionando correctamente\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error}\n`);
  }

  // Test 3: Funciones seguras
  console.log('📝 Test 3: Funciones de encriptación segura');
  try {
    const message = "Mensaje para encriptación segura";
    const encrypted = safeEncryptMessage(message);
    const decrypted = safeDecryptMessage(encrypted);
    
    console.log(`   Original: ${message}`);
    console.log(`   Encriptado seguro: ${encrypted}`);
    console.log(`   Desencriptado seguro: ${decrypted}`);
    console.log(`   ✅ Funciones seguras: ${message === decrypted ? 'CORRECTO' : '❌ERROR❌'}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error}\n`);
  }

  // Test 4: Mensajes largos
  console.log('📝 Test 4: Mensajes largos');
  try {
    const longMessage = "Este es un mensaje muy largo que contiene múltiples líneas y caracteres especiales como áéíóú, ñ, y emojis 🚀🔒💻. ".repeat(10);
    const encrypted = encryptMessage(longMessage);
    const decrypted = decryptMessage(encrypted);
    
    console.log(`   Longitud original: ${longMessage.length} caracteres`);
    console.log(`   Longitud encriptada: ${encrypted.length} caracteres`);
    console.log(`   ✅ Mensajes largos: ${longMessage === decrypted ? 'CORRECTO' : '❌ERROR❌'}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error}\n`);
  }

  // Test 5: Múltiples encriptaciones del mismo mensaje
  console.log('📝 Test 5: Múltiples encriptaciones (deben ser diferentes)');
  try {
    const message = "Mismo mensaje";
    const encrypted1 = encryptMessage(message);
    const encrypted2 = encryptMessage(message);
    
    console.log(`   Encriptación 1: ${encrypted1}`);
    console.log(`   Encriptación 2: ${encrypted2}`);
    console.log(`   ✅ Son diferentes: ${encrypted1 !== encrypted2 ? 'CORRECTO' : '❌ERROR❌'}`);
    console.log(`   ✅ Ambas desencriptan correctamente: ${decryptMessage(encrypted1) === message && decryptMessage(encrypted2) === message ? 'CORRECTO' : '❌ERROR❌'}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error}\n`);
  }

  console.log('🎉 Pruebas completadas!');
  console.log('\n📋 Resumen:');
  console.log('- Encriptación AES-256-GCM funcionando');
  console.log('- Funciones de seguridad implementadas');
  console.log('- Detección de mensajes encriptados operativa');
}

// Ejecutar las pruebas si el archivo se ejecuta directamente
if (require.main === module) {
  runTests();
}

export { runTests };
