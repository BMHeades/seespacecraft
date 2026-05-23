import { error } from "node:console";

export async function horizons(majorBodyName: string, majorBodyID: number) {

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
    const data_text = await response.text()

    
    try{

        const data = JSON.parse(data_text)
            const position = {
            x: trim(Number(data.result.match(/X\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1])),
            y: trim(Number(data.result.match(/Y\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1])),
            z: trim(Number(data.result.match(/Z\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1])),
        }
        
        const velocity = {
            x: trim(Number(data.result.match(/VX\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]) * 1000),
            y: trim(Number(data.result.match(/VY\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]) * 1000),
            Z: trim(Number(data.result.match(/VZ\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]) * 1000),
        }
        
        const distance = trim(Number(data.result.match(/RG\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/)[1]))
    
        const updated_at = new Date(now).toISOString()
    
        return {
            name: majorBodyName,
            id: majorBodyID,
            updated_at,
            position,
            velocity,
            distance
        }
    }
    catch(err){
        // data rate limit
        if(data_text.startsWith("<!DOCTYPE")){
            console.log(`[RATE LIMIT] Could not fetch data for ${majorBodyID}`)
        }
        return {
            id: 0,
            updated_at: 0,
            position: 0,
            velocity: 0,
            distance:0
        }
    }
}

function trim(num: number): number{
    return Math.round(num / 50) * 50
}

// test 
const data = await horizons("name", -143205)
console.log(data)