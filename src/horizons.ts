export async function horizons(majorBodyID: number) {

    const now = Date.now()
    const params = new URLSearchParams({
        format: 'json',
        COMMAND: `'${majorBodyID}'`,
        OBJ_DATA: 'NO',
        EPHEM_TYPE: 'VECTORS',
        START_TIME: new Date(now).toISOString(), // NOW
        STOP_TIME: new Date(now + 10000 ).toISOString(), // 10 seconds in future
    }); 
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params}`;
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
    })
    const data = await response.json()

    const position = {
        x: Number(data.result.match(/X\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]),
        y: Number(data.result.match(/Y\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]),
        z: Number(data.result.match(/Z\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]),
    }
    
    const velocity = {
        x: Number(data.result.match(/VX\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]),
        y: Number(data.result.match(/VY\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]),
        Z: Number(data.result.match(/VZ\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]),
    }
    
    const distance = Number(data.result.match(/RG\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1])

    const updated_at = new Date(now).toISOString()

    return {
        id: majorBodyID,
        updated_at,
        position,
        velocity,
        distance
    }
}
