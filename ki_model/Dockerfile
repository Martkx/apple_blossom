FROM python:3.12

WORKDIR /code

RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y libhdf5-dev && apt-get install -y libgl1-mesa-glx 
RUN pip install --no-binary h5py h5py

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -r /code/requirements.txt

COPY . /code/ki_model


EXPOSE 8080

CMD [ "uvicorn", "ki_model.api:app", "--host", "0.0.0.0", "--port", "8080"]