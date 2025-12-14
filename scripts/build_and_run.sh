podman build . -t cyclepaths-web
podman run --replace --name=CyclePaths-Web -p 5173:5173 cyclepaths-web