FROM python:3.10-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
COPY ./dependencies /dependencies

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir --find-links=/dependencies -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
