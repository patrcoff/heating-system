from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from datetime import time as T

class Item(BaseModel):
    #profile: str
    boost: int | None = None
    day_temp: float | None = None
    night_temp: float | None = None
    times: list | None = None


settings = {'boost': datetime.strptime('2023-02-09T23:00:00','%Y-%m-%dT%H:%M:%S'),
            'day_temp': 20.5,
            'night_temp': 16.0,
            'times': [(T(hour=21),str(T(hour=22))),(T(hour=23),str(T(hour=23,minute=30)))]
}

app = FastAPI()

@app.get('/')
def get_all():
    return 'current + profile + times'

@app.get('/profile')
def read_root():
    return 'return all details of current profile'

@app.get('/profile/{id}')
def get_profile():
    return 'json repr of profile {id}'

@app.post('/profile/')
def create_profile():
    return 'create profile x'

@app.put("/profile/{id}")
def set_settings(item: Item):
    return 'edit profile {id}'



#get all settings


"""
tables:

    current:
        id=1
        profile_id
        boost
        override

    profile
        id
        name
        day_temp
        night_temp

    times
        id
        profile_id
        start_time
        end_time
"""