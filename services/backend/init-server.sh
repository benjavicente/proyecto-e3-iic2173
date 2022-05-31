
# Create DB
yarn sequelize-cli db:create || true

# Populate DB
yarn sequelize-cli db:migrate:undo:all
yarn sequelize-cli db:migrate
yarn sequelize-cli db:seed:all

# Start server
yarn start
