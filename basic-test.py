import socket

hn = socket.gethostname()

print(f'Hello world - this is running on the remote server: {hn}')