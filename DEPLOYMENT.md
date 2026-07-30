# RiadKit Deployment Guide

## Prerequisites

- PHP 8.3+
- Composer 2.x
- Node.js 20+
- npm 10+
- SQLite (development) or MySQL 8.0+ (production)
- Redis 7+ (for queues/cache)
- Supervisor (for queue worker)
- Nginx or Caddy (for production)
- Chrome/Chromium (for QR code PDF generation via Browsershot)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `APP_KEY` | Yes | Laravel app key - run `php artisan key:generate` |
| `APP_ENV` | Yes | `production` in production |
| `APP_DEBUG` | Yes | `false` in production |
| `APP_URL` | Yes | Backend URL (e.g., `https://api.riadkit.com`) |
| `FRONTEND_URL` | Yes | Frontend URL (e.g., `https://riadkit.com`) |
| `DB_CONNECTION` | Yes | `mysql` or `sqlite` |
| `DB_HOST` | MySQL only | Database host |
| `DB_PORT` | MySQL only | Database port |
| `DB_DATABASE` | MySQL only | Database name |
| `DB_USERNAME` | MySQL only | Database user |
| `DB_PASSWORD` | MySQL only | Database password |
| `BROADCAST_CONNECTION` | Yes | `reverb` for WebSocket support |
| `QUEUE_CONNECTION` | Yes | `database` or `redis` |
| `CACHE_STORE` | Yes | `database` or `redis` |
| `SESSION_DRIVER` | Yes | `database` or `redis` |
| `SANCTUM_STATEFUL_DOMAINS` | Yes | Comma-separated frontend domains for SPA auth |
| `REVERB_APP_ID` | Yes | Reverb app ID |
| `REVERB_APP_KEY` | Yes | Reverb app key |
| `REVERB_APP_SECRET` | Yes | Reverb app secret |
| `REVERB_HOST` | Yes | Reverb host (e.g., `0.0.0.0` in production) |
| `REVERB_PORT` | Yes | Reverb port (e.g., `8080`) |
| `REVERB_SCHEME` | Yes | `https` in production |
| `CLOUDINARY_URL` | No | Required for image uploads. Format: `cloudinary://key:secret@cloud_name` |
| `MAIL_MAILER` | No | `log` or `smtp` |
| `LOG_LEVEL` | No | `warning` or `error` in production |

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g., `https://api.riadkit.com`) |
| `NEXT_PUBLIC_REVERB_APP_KEY` | Yes | Must match `REVERB_APP_KEY` from backend |
| `NEXT_PUBLIC_REVERB_HOST` | Yes | Reverb host (e.g., `api.riadkit.com`) |
| `NEXT_PUBLIC_REVERB_PORT` | Yes | Reverb port (e.g., `443` for WSS) |
| `NEXT_PUBLIC_REVERB_SCHEME` | Yes | `https` in production |

---

## Backend Deployment

### 1. Install Dependencies

```bash
cd backend
composer install --no-dev --optimize-autoloader
```

### 2. Configure Environment

```bash
cp .env.example .env
vim .env  # Fill in all required values
php artisan key:generate
```

### 3. Run Migrations & Seeders

```bash
php artisan migrate --force
php artisan db:seed --force
```

### 4. Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan event:cache
```

### 5. Storage Link (for public assets)

```bash
php artisan storage:link
```

### 6. Queue Worker (Supervisor)

Create `/etc/supervisor/conf.d/riadkit-worker.conf`:

```ini
[program:riadkit-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
directory=/path/to/backend
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/backend/storage/logs/supervisor.log
stopwaitsecs=600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start riadkit-worker:*
```

### 7. Reverb (WebSocket) via Supervisor

Create `/etc/supervisor/conf.d/riadkit-reverb.conf`:

```ini
[program:riadkit-reverb]
command=php /path/to/backend/artisan reverb:start
directory=/path/to/backend
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/path/to/backend/storage/logs/reverb.log
stopwaitsecs=600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start riadkit-reverb:*
```

### 8. Web Server (Nginx)

```nginx
server {
    listen 443 ssl;
    server_name api.riadkit.com;

    root /path/to/backend/public;
    index index.php;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 9. Reverb WebSocket Proxy (Nginx - if using subdomain)

```nginx
server {
    listen 443 ssl;
    server_name ws.riadkit.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Frontend Deployment

### 1. Install Dependencies

```bash
cd frontend
npm ci
```

### 2. Configure Environment

```bash
cp .env.example .env.local
vim .env.local  # Fill in all required values
```

### 3. Build

```bash
npm run build
```

### 4. Start (Production)

```bash
npm run start  # Listens on port 3000 by default
```

Or deploy to a hosting platform (Vercel recommended):

```bash
npx vercel --prod
```

### 5. Web Server (Nginx - if self-hosting)

```nginx
server {
    listen 443 ssl;
    server_name riadkit.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Quick Start (Development)

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve  # API at http://localhost:8000
```

In separate terminals:

```bash
php artisan queue:listen
php artisan reverb:start  # WebSocket at http://localhost:8080
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev  # UI at http://localhost:3000
```

---

## Common Commands

```bash
# Backend
php artisan migrate:fresh --seed   # Reset and seed database
php artisan optimize:clear         # Clear all caches
php artisan reverb:start           # Start WebSocket server
php artisan queue:listen           # Start queue worker

# Frontend
npm run dev                        # Development server
npm run build                      # Production build
npm run lint                       # Run ESLint
```
