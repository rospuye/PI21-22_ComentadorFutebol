## How to Run with Docker Compose

### Build

    docker compose build
  
### Run

    docker compose up [OPTIONS]

- OPTIONS:
    - --build
    - -d, --detach
    
### Restart container

    docker compose restart <container_name>

### Django wants migrations?

    docker exec -it django-api sh

Then:
    
    python manage.py migrate    
    exit

Finally restart django container