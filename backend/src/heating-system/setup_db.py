from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship, Session
#from sqlalchemy.orm import Session

from dbmodels import Profile, Time, Current, Log, Base, engine


Base.metadata.create_all(engine)

"""
session = Session(bind=engine, expire_on_commit=False)

p1 = Profile(name='test1',day_temp=20.5,night_temp=16.0)
session.add(p1)
cur1 = Current(profile_id=1,boost="test",override_on=False,override_off=False)
session.add(cur1)
session.commit()
session.close()
"""