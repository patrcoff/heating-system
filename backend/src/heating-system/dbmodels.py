from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Boolean, Time, DateTime, TIMESTAMP
from sqlalchemy import func
from sqlalchemy.orm import declarative_base, relationship
engine = create_engine("sqlite:///heating.db")
Base = declarative_base()

class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(Integer, primary_key=True)
    name = Column(String(25),unique=True)
    day_temp = Column(Float)
    night_temp = Column(Float)
    times = relationship('Time')

class Time(Base):
    __tablename__ = 'times'
    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    start_time = Column(Time)
    end_time = Column(Time)

class Current(Base):
    __tablename__ = 'current'
    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    boost = Column(DateTime)
    override_on = Column(Boolean)
    override_off = Column(Boolean)

class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True)
    timestamp = Column(TIMESTAMP, server_default=func.now())
    source_id = Column(String(50)) # for now we only have one sensor connected to the actual relay itself, but in future may add more temp sensors
    temperature = Column(Float)
    burner = Column(Boolean)




#this will be needed in the other python file

