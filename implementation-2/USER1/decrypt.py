from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
import base64

with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(key_file.read(), password=None)


def decrypt_data(private_key, encrypted_data):
    decrypted_data = private_key.decrypt(
        encrypted_data,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    return decrypted_data.decode()


try:
    encrypted_cookie = input("Enter Encrypted Cookie Data: ")
    encrypted_cookie = base64.b64decode(encrypted_cookie)
    decrypted_cookie = decrypt_data(private_key, encrypted_cookie)
    print(f"Decrypted Cookie: {decrypted_cookie}")
except Exception as e:
    print(f"Error: {e}")
