from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
#from datetime import datetime
#from datetime import time as T
from sqlalchemy.orm import Session
from dbmodels import Profile, Time, Current, Log, Base, engine
from contextlib import contextmanager
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, time, timedelta
from pathlib import Path
#Base.metadata.create_all(engine)



@contextmanager
def session():
    db_session = Session(bind=engine, expire_on_commit=False)
    try:
        yield db_session
    finally:
        db_session.close()

#this is to create default 'current' data for deb purposes when db has been deleted and rebuilt
#it simply stops errors from using other endpoints below which make use of getting the current data as part of their operation
with session() as s:
    if not s.query(Current).get(1):
        #session = Session(bind=engine, expire_on_commit=False)
        #p1 = Profile(name='test1',day_temp=20.5,night_temp=16.0)
        #s.add(p1)
        cur1 = Current(profile_id=1,boost=datetime.now(),override_on=False,override_off=False)
        s.add(cur1)
        s.commit()


class ProfileJSON(BaseModel):  #where properties are required
    name: str
    day_temp: float
    night_temp: float

class ProfileUpdate(BaseModel):  # where properties are optional (for updating)
    name: str | None = None
    day_temp: float | None = None
    night_temp: float | None = None

class TimesUpdate(BaseModel):
    profile_id: int | None = None
    start_time: time | None = None
    end_time: time | None = None

class TimesAdd(BaseModel):
    profile_id: int
    start_time: time
    end_time: time

#we do not need a current class, we will only ever update the first current record, with the id of the profile we wish to update
#this could either be done via a query of the profile.name or directly with the profile id...

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://192.168.1.177:3000",
    "http://192.168.1.177",
    "http://192.168.1.177:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#print(Path('.').absolute())
#app.mount('/static', StaticFiles(directory='static'), name='controls')
app.mount('/controls', StaticFiles(directory='../../../frontend/heating-frontend/build/'))

@app.get('/api/current')
def get_all():
    with session() as s:
        response = {}
        response['current'] = (current := s.query(Current).get(1))
        response['profile'] = (profile := s.query(Profile).get(current.profile_id))
        profile.times  # relationships need 'called' to populate (not sure on terminology there) - there may be an auto-populate setting or something I missed in the model?
    return response

#@app.get('/current')
#def get_current():
#    with session() as s:
#        response = {}
#        response['current'] = (current := s.query(Current).get(1))
#    return response

@app.put('/api/current')
def edit_current(override_on: bool | None = None, override_off: bool  | None = None, profile_id: int  | None = None, boost: datetime | None = None):
    with session() as s:
        current = s.query(Current).get(1)
        set_profile = profile_id
        set_override_on = override_on
        set_override_off = override_off
        set_boost = boost

        if set_profile:
            current.profile_id = profile_id
        if set_override_on:
            current.override_on = override_on
        if set_override_off:
            current.override_off = override_off
        if set_boost:
            current.boost = boost
        s.add(current)
        s.commit()

@app.put('/api/current/profile/{id}')  #set the current profile (i.e. selected/active profile etc) by id
def update_current_profile(id: int):
    with session() as s:
        current_profile = s.query(Current).get(1)
        current_profile.profile_id = id
        s.add(current_profile)
        s.commit()

@app.get('/api/profile')  #  this is really kind of redundant as we have this info as part of '/'
def get_current_profile():
    with session() as s:
        response = {}
        current = s.query(Current).get(1)
        response['profile'] = (profile := s.query(Profile).get(current.profile_id))
        profile.times
    return response

#  I think that I want to refactor the profile(s) endpoints here
#  ther should be only one /profile root endpoint 
#  it will handle getting both multiple and individual profiles
#  it will handle posting and putting individual profiles
#  examples
#  /profile - return all profiles
#  /profile/x - interact with profile of id x
#  the current profile will be obtained from the '/' endpoint (which may change to /current)

@app.get('/api/profiles')
def get_current_profile():
    with session() as s:
        response = {}
        response['profiles'] = (profiles := s.query(Profile).all())
        for profile in profiles:
            profile.times

    return response

@app.get('/api/profile/{profile_id}')
def get_profile(profile_id: int):

    with session() as s:
        response = {}
        p = (profile := s.query(Profile).get(profile_id))
        response['profile'] = p
        if not p:
            ...
    return response

@app.post('/api/profile/new')
def create_profile(profile: ProfileJSON):
    with session() as s:
        prof = Profile(name=profile.name, day_temp=profile.day_temp,night_temp=profile.night_temp)
        s.add(prof)
        s.commit()
    return f'created profile {profile.name}'

@app.put("/api/profile/{id}")
def set_settings(profile: ProfileUpdate, id: int):
    with session() as s:
        prof = s.query(Profile).get(id)
        if profile.name:
            prof.name = profile.name
        if profile.day_temp:
            prof.day_temp = profile.day_temp
        if profile.night_temp:
            prof.night_temp = profile.night_temp
        s.add(prof)
        s.commit()
        #set each part of profile which is not null
    return f'edit profile {id}'

@app.post("/api/boost")
def toggle_boost():
    """Increase the boost time by 30 minutes up to 2 hours away, otherwise set to past to reset"""
    with session() as s:
        #get current boost  time
        current = s.query(Current).get(1)
        boost_time = current.boost

        if boost_time < datetime.now():
            #if boost is in the past (are you from the past?)
            boost_time = datetime.now() + timedelta(minutes=30)
            
        else:
            #  is in the future or present
            boost_time = boost_time + timedelta(minutes=30)
            if boost_time > (datetime.now() + timedelta(minutes=120)):  # if boost is now over 2 hours away, reset to past
                boost_time = datetime.now() + timedelta(minutes=-20)
        current.boost = boost_time
        s.add(current)
        s.commit()

    return boost_time


    #if time in past, add 30 mins from datetime.now()
    #else, just add 30 mins

    #if new time > 2hrs in future, set to a minute ago

    #here we want to check the current boost value and if it is in future, add 30 mins, if in past, add 30 mins from now

@app.get('/api/times/{id}')
def get_times(id: int):
    with session() as s:
        times = s.query(Time).all()
        #times = s.query(Time).filter(Time.profile_id == id)
    return times

@app.post('/api/times')
def add_times(times: TimesAdd):
    #print(times)
    with session() as s:
        existing_times = s.query(Time).filter(Time.profile_id == times.profile_id)
        index = len(list(existing_times))

        t = Time(profile_id = times.profile_id,
                start_time = times.start_time,
                end_time = times.end_time
            )
        s.add(t)
        s.commit()
    return f'Successfully added time range {index}'

@app.put('/api/times/{id}')
def add_times(id: int, times_data : TimesUpdate):  # we are intentionally leaving out profile id as a time record shouldn't be moved between profiles

    with session() as s:
        selected_time = s.query(Time).get(id)
        
        if times_data.start_time:
            selected_time.start_time = times_data.start_time
            #print(times_data.start_time)
        if times_data.end_time:
            selected_time.end_time = times_data.end_time
            #print(times_data.end_time)
        #print(selected_time.start_time, selected_time.end_time)
        s.add(selected_time)
        s.commit()
    return f'Successfully added time range {id}'

    #testing gitignore