import hmac
import hashlib
import struct
import time
import base64
import urllib.request
import urllib.error
import json


def generate_totp(secret):
    t = int(time.time()) // 30
    msg = struct.pack(">Q", t)
    key = secret.encode("utf-8")
    h = hmac.new(key, msg, hashlib.sha512).digest()
    offset = h[-1] & 0x0F
    code = struct.unpack(">I", h[offset:offset + 4])[0]
    code = (code & 0x7FFFFFFF) % 10000000000
    return str(code).zfill(10)


def main():
    email = "iqrazaf05@gmail.com"
    gist_url = "https://gist.github.com/Iqra171/083a6498857edecdb99d5d25c672addb"

    secret = email + "HENNGECHALLENGE004"
    totp = generate_totp(secret)

    print(f"Generated TOTP: {totp}")

    payload = json.dumps({
        "github_url": gist_url,
        "contact_email": email,
        "solution_language": "python"
    }).encode("utf-8")

    credentials = base64.b64encode(f"{email}:{totp}".encode("utf-8")).decode("utf-8")

    url = "https://api.challenge.hennge.com/challenges/backend-recursion/004"
    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Basic {credentials}")

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.status}")
            print(f"Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"Error {e.code}: {e.read().decode()}")


if __name__ == "__main__":
    main()