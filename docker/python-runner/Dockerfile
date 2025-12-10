FROM python:3.11-slim

# Minimal image for running untrusted user code under docker isolation
# Keep it small, non-root, and with unbuffered stdout
ENV PYTHONUNBUFFERED=1

# Create a non-root user
RUN useradd -m runner
USER runner
WORKDIR /home/runner

# No additional packages required; image built from official python base
CMD ["python", "-u", "-"]
