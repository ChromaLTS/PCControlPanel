const fs = require('fs');
const elliptic = require('elliptic');

// Create an elliptic curve object for Curve25519
const curve = new elliptic.ec('curve25519');

// Function to generate Curve25519 key pair
function generateKeyPair() {
  const key = curve.genKeyPair();
  return {
    publicKey: key.getPublic('hex', 'compressed'),
    privateKey: key.getPrivate('hex')
  };
}


function genKey ()
{

  
  // Generate key pair
  const { privateKey, publicKey } = generateKeyPair()
  
  // Save private key to a file
  fs.writeFileSync('privateKey.pem', privateKey);
  console.log('Private Key saved to privateKey.pem');
  
  // Save public key to a file
  fs.writeFileSync('publicKey.pem', publicKey);
  console.log('Public Key saved to publicKey.pem');

}


module.exports = genKey