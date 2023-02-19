from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship, Session
from datetime import datetime
#from sqlalchemy.orm import Session

from dbmodels import Profile, Time, Current, Log, Base, engine


Base.metadata.create_all(engine)


session = Session(bind=engine, expire_on_commit=False)

p1 = Profile(name='Summer',day_temp=20.0,night_temp=15.0)
session.add(p1)
p2 = Profile(name='Winter',day_temp=21.0,night_temp=16.0)
session.add(p2)
cur1 = Current(profile_id=1,boost=datetime.now(),override_on=False,override_off=False)
session.add(cur1)



session.commit()



session.close()
