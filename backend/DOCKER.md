# Docker Development Setup

This directory contains Docker Compose configuration for running PostgreSQL during development.

## Quick Start

1. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Start both database and pgAdmin:**
   ```bash
   docker-compose up -d
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

4. **Stop services and remove volumes (⚠️ this will delete all data):**
   ```bash
   docker-compose down -v
   ```

## Services

### PostgreSQL Database
- **Port:** 5432
- **Database:** ceciliosweets
- **Username:** myuser
- **Password:** mypassword
- **Connection URL:** `postgresql://myuser:mypassword@localhost:5432/ceciliosweets`

### pgAdmin (Optional)
- **URL:** http://localhost:8080
- **Email:** admin@ceciliosweets.com
- **Password:** admin

To connect to the database in pgAdmin:
- Host: `postgres` (when running in Docker) or `host.docker.internal` (on Windows/Mac)
- Port: 5432
- Username: myuser
- Password: mypassword
- Database: ceciliosweets

## Data Persistence

Database data is persisted in Docker volumes:
- `postgres_data`: PostgreSQL data
- `pgadmin_data`: pgAdmin settings and configurations

## Useful Commands

```bash
# View logs
docker-compose logs postgres
docker-compose logs pgadmin

# Connect to PostgreSQL container
docker-compose exec postgres psql -U myuser -d ceciliosweets

# Backup database
docker-compose exec postgres pg_dump -U myuser ceciliosweets > backup.sql

# Restore database
docker-compose exec -T postgres psql -U myuser ceciliosweets < backup.sql
```

## Environment Variables

Make sure your `.env` file matches the database configuration in `docker-compose.yml`:

```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/ceciliosweets
```

## Notes

- The PostgreSQL container will automatically create the database `ceciliosweets` on first run
- Data is persisted between container restarts
- You can customize usernames, passwords, and database names by editing the `docker-compose.yml` file
