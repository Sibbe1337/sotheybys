module.exports = {
  apps: [{
    name: 'sothebys-next-front',
    script: 'pnpm',
    args: 'start',
    cwd: '/Users/emilsoujeh/sothebys/apps/next-front',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    // Load environment variables from .env.local
    env_file: '.env.local',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    time: true,
    // Restart if it crashes
    min_uptime: '10s',
    max_restarts: 10,
    // Graceful shutdown
    kill_timeout: 5000,
    // Keep process alive
    exp_backoff_restart_delay: 100,
    // Network configuration
    listen_timeout: 8000,
    // Cluster mode settings (if you want to use multiple CPU cores)
    exec_mode: 'fork', // Change to 'cluster' to use multiple cores
    // instances: 'max', // Uncomment to use all available CPU cores
  }]
};
