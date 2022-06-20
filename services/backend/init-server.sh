
# Create DB
yarn sequelize-cli db:create || true

# Populate DB
# TODO: no debería botar la BDD cada vez que se ejecuta el script
yarn sequelize-cli db:migrate:undo:all
yarn sequelize-cli db:migrate
yarn sequelize-cli db:seed:all

# Start server
yarn $1
