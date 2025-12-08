build:
	@echo "Buidlig full application..."
	docker-compose build

up:
	@echo "Running full application..."
	docker-compose up

down:
	@echo "Removing all containers..."
	docker-compose down

# Run all tests
test: test-api test-frontend


# ---- Backend Commands ----

build-api:
	@echo "Building api..."
	docker-compose build api

up-api:
	@echo "Running api..."
	docker-compose up api

test-api:
	@echo "Running backend tests..."
	docker-compose run --rm -e FLASK_ENV=testing api pytest

test-api-watch:
	@echo "Running backend tests in watch mode..."
	docker-compose run --rm -e FLASK_ENV=testing api ptw


# ---- Frontend Commands ----

build-frontend:
	@echo "Building frontend..."
	docker-compose build frontend

up-frontend:
	@echo "Running frontend..."
	docker-compose up frontend

test-frontend:
	@echo "Running frontend tests..."
	docker-compose run --rm frontend npm test -- --run

test-frontend-watch:
	@echo "Running frontend tests in watch mode..."
	docker-compose run --rm frontend npm test


# ---- Migrations ----

db-init:
	@echo "Initialising database..."
	docker-compose run --rm api flask db init

db-migrate:
	@echo "Running database migrations..."
	docker-compose run --rm api flask db migrate

db-upgrade:
	@echo "Upgrading database..."
	docker-compose run --rm api flask db upgrade
