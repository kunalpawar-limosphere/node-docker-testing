# node-docker-testing

This project is a minimal Node.js + Express example that connects to a MySQL database.

Endpoints:
- GET / -> basic info and DB connection status
- GET /health -> health check
- GET /all -> list all rows in `people` (table has id and name)
- POST /insert -> insert a person (json body: { "name": "Alice" })

Quick start (local without Docker Compose)

1. Install dependencies:

```bash
npm install
```

2. Start a MySQL server. To learn Docker (no docker-compose), you can start MySQL with a single `docker run` command:

```bash
# Run MySQL 8, expose port 3306, set root password and create a database named testdb
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=testdb \
  -p 3306:3306 \
  mysql:8
```

3. Set environment variables (create a `.env` file) so the Node app can connect to MySQL. Example `.env`:

```
PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=secret
MYSQL_DATABASE=testdb
```

4. Run the app:

```bash
npm start
```

The app will create a `people` table on startup (if it doesn't exist) and seed it with two rows (Alice and Bob) when the table is empty.

Testing endpoints (examples):

# List all
curl http://localhost:3000/all

# Insert
curl -X POST -H "Content-Type: application/json" -d '{"name":"Charlie"}' http://localhost:3000/insert

Notes
- The project uses Sequelize ORM for database operations (MySQL dialect).
- The project no longer uses Docker Compose by design so you can learn Docker commands directly. If you prefer Compose you can create a compose file later.
- Provide env vars via `.env` or system environment variables.

