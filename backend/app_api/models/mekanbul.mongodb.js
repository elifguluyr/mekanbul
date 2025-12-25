const database = 'mekanbul';
use(database);
db.venues.insertOne(
{
  "name": "Hariye Kafe",
  "address": "Iyaş",
  "rating": 5,
  "foodanddrink": [
    "kruvasan",
    "çay",
    "kahve",
    "pasta"
  ],
  "coordinates": [
    37.76440123987801,
    30.55200587463379
  ],
  "hours": [
    {
      "days": "Pazartesi-Cuma",
      "open": "9:00",
      "close": "00:00",
      "isClosed": false
    },
    {
      "days": "Cumartesi-Pazar",
      "open": "10:00",
      "close": "22:00",
      "isClosed": false
    }
  ]
}
 );

 db.venues.insertOne(
{
  "name": "Mersos",
  "address": "Iyaş",
  "rating": 4,
  "foodanddrink": [
    "döner",
    "patates kızartması",
    "ayran"
  ],
  "coordinates": [
    37.8315,
    30.5235
  ],
  "hours": [
    {
      "days": "Pazartesi-Cuma",
      "open": "10:00",
      "close": "01:00",
      "isClosed": false
    }
  ]
}
    );
 db.venues.insertOne(
  { 
  "name": "Hanedan Restaurant",
  "address": "Iyaş",
  "rating": 3,
  "foodanddrink": [
    "lahmacun",
    "pide",
    "ayran"
  ],
  "coordinates": [
    37.8317,
    30.5237
  ],
  "hours": [
    {
      "days": "Pazartesi-pazar",
      "open": "11:00",
      "close": "23:00",
      "isClosed": false
    }
  ]
}
    );

 db.venues.insertOne(
{
  "name": "Luca kafe",
  "address": "Iyaş",
  "rating": 2,
  "foodanddrink": [
    "waffle",
    "dondurma",
    "kahve"
  ],
  "coordinates": [
    37.8319,
    30.5239
  ],
  "hours": [
    {
      "days": "Salı-Pazar",
      "open": "10:00",
      "close": "01:00",
      "isClosed": false
    }
  ]
}
    ); 

 db.venues.insertOne(
{
  "name": "Rumeli Tulumbacısı",
  "address": "Iyaş",
  "rating": 4,
  "foodanddrink": [
    "tulumba",
    "baklava",
    "sütlaç",
    "kazandibi"
  ],
  "coordinates": [
    37.8321,
    30.5241
  ],
  "hours": [
    {
      "days": "Pazartesi-Cuma",
      "open": "09:00",
      "close": "23:00",
      "isClosed": false
    }
  ]
}
 );