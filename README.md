#"SeeSpaceCraft" API

##About
Grabs data from NASA JPL Horizon and redistributes it in easy-to-use and scalable manner.
Made as part of a Computer Science Club project at TCC Spring 2026.

##API
Available routes -

```
/saturn
/space-x-roadster
/hubble
/james-webb
/voyager-1
/voyager-2
```

Return format
```
{
    id: number                  // JPL HORIZONS MAJOR BODY ID
    updated_at: string          // LAST TIME DATA WAS UPDATED IN UTC
    position{
        x: number               // POSITION X COORDINATE (km)
        y: number               // POSITION Y COORDINATE (km)
        z: number               // POSITION Z COORDINATE (km)
    }
    velocity{
        x: number               // VELOCITY X COORDINATE (km)
        y: number               // VELOCITY Y COORDINATE (km)
        z: number               // VELOCITY Z COORDINATE (km)
    }
    distance: number            // DISTANCE FROM CENTER OF THE EARTH (km)
}
```
Data is updated every hour.
The x-y plane is based on the orbit of the Earth around the Sun centered at the Earth.

For more information, visit [([NASA JPL HORIZONS]](https://ssd.jpl.nasa.gov/horizons/manual.html)