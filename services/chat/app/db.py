import aioredis
from sqlalchemy_utils import create_database, database_exists
from sqlmodel import SQLModel, create_engine

from .config import config

engine = create_engine(config.database_url)
redis = aioredis.from_url(config.redis_url)


def init_db():
    if not database_exists(config.database_url):
        create_database(config.database_url)
    SQLModel.metadata.create_all(engine)
