from sqlmodel import create_engine, SQLModel
from sqlalchemy_utils import database_exists, create_database
from .config import config

engine = create_engine(config.database_url, echo=True)


def init_db():
    if not database_exists(config.database_url):
        create_database(config.database_url)
    SQLModel.metadata.create_all(engine)
