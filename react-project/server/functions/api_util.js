const fs = require('fs');
const crypto = require('crypto');
const genKey = require('./genKey.js')

function readPEMKey(type) {
    const privateKeyPath = './privateKey.pem';
    const publicKeyPath = './publicKey.pem';
    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
      genKey()
    }

    if (type === "private") {
        try {
        const keyData = fs.readFileSync(privateKeyPath, 'utf8');
    
        return keyData.trim();
        } catch (error) {
        console.error(`Error reading PEM key from file: ${error.message}`);
        return null;
        }
    }
    else if (type === "public") {
        try {
        const keyData = fs.readFileSync(publicKeyPath, 'utf8');
    
        return keyData.trim();
        } catch (error) {
        console.error(`Error reading PEM key from file: ${error.message}`);
        return null;
        }
    }
}


// Function to perform ECDH key exchange
function performECDH(localPrivateKey, remotePublicKey) {
    const localKey = curve.keyFromPrivate(localPrivateKey, 'hex');
    const remoteKey = curve.keyFromPublic(remotePublicKey, 'hex');
    const sharedSecret = localKey.derive(remoteKey.getPublic());

    // The derived shared secret is a Buffer
    return sharedSecret.toString('hex');
}

// Function to encrypt a message using AES
function encryptMessage(message, symmetricKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(symmetricKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(message, 'utf-8'), cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Function to decrypt a message using AES
function decryptMessage(encryptedData, iv, symmetricKey) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(symmetricKey, 'hex'), Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
    return decrypted.toString('utf-8');
}

module.exports = {readPEMKey, performECDH, encryptMessage, decryptMessage}