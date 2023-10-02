from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
import base64

# Load your private key from a file (replace 'private_key.pem' with your private key file)
with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(key_file.read(), password=None)


# Function to encrypt data using a public key
def encrypt_data(public_key, data):
    encrypted_data = public_key.encrypt(
        data.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    return encrypted_data


# Function to decrypt data using a private key

# Example usage:
cookie_data = input("Enter Cookie Data: ")

# Encrypt the cookie data with the public key
encrypted_cookie = encrypt_data(private_key.public_key(), cookie_data)
encrypted_cookie = base64.b64encode(encrypted_cookie)
print(f"Encrypted Cookie: {encrypted_cookie}")
# Simulate using the cookie on another computer with a different private key
# This should fail to decrypt because the private key is different
