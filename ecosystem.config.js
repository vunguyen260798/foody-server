module.exports = {
    apps : [{
      name: 'SERVER-MUSIC-APP',
      cwd:"./",
      script: 'server.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT:3000
      }
    }]
  };
  