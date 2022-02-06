FROM denoland/deno:1.18.2

# The port that your application listens to.
EXPOSE 7070

WORKDIR /app

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY /src/deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY /src .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "main.ts"]