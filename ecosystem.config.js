module.exports = {
  apps: [
    {
      name: "frontend-react-dev",
      script: "serve",
      args: "-s build -l 3001", // Dev runs on port 3001
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "frontend-react-prod",
      script: "serve",
      args: "-s build -l 3000", // Prod runs on port 3000
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
