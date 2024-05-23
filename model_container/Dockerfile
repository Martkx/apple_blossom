FROM python:3.11

WORKDIR /code

RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y libhdf5-dev
RUN pip install --no-binary h5py h5py

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -r /code/requirements.txt

COPY . /code/model_container


EXPOSE 8080

CMD [ "uvicorn", "model_container.api:app", "--host", "0.0.0.0", "--port", "8080"]