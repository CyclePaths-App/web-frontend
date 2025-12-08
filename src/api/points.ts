import axios from "axios";

/**
 * getPoints(): Gets points in the specified window for display on the heatmap. If you want to specify a trip type, set the `trip` 
 * field in the options object to either `"bike"` or `"walk"`. If you want to only get the destinations, set the `justDestinations` field in the options object to
 * `true`.
 * 
 * @param northLatitude The northern bound of the window.
 * @param southLatitude The southern bound of the window.
 * @param eastLongitude The eastern bound of the window.
 * @param westLongitude The western bound of the window.
 * @param options Options to specify a specific trip type or to limit points to only be destinations.
 * 
 * @returns An array of points on success, or null if there are not enough users inside the window. Calls `alert()` on unexpected errors.
 */
export async function getPoints(
  northLatitude: number, 
  southLatitude: number, 
  eastLongitude: number, 
  westLongitude: number, 
  options?:WindowOptions
): Promise<Point[] | null> {
    const BASE_URL = `http://localhost:8000/points/${northLatitude}/${southLatitude}/${eastLongitude}/${westLongitude}`;
    let url = BASE_URL;

    if(options){
      url += '?'; // Allows optional arguments.
      if(options.type){
        url += `type=${options.type}&`;
      }
      if(options.justDestinations){
        url += `justDestinations=${options.justDestinations}`;
      }
    }

    return axios.get(url).then((res)=>{
      const result: unknown = res.data
      switch(res.status){
        case 200: {
          return result as Point[];
        }
        case 400: {
          alert(`Incorrect Arguments: ${res.data}`);
          return null;
        }
        case 403: {
          return null;
        }
        case 404: {
          alert(`Resource not found. Is the backend up?`);
          return null;
        }
        case 500: {
          alert(`Internal server error.`);
          return null;
        }
        default: {
          alert(`Unknown error: ${res.status}: ${res.data}`);
          return null;
        }
      }
    }).catch()
}

export type Point = {
  longitude: number;
  latitude: number;
  time: Date;
  speed: number;
};

export type WindowOptions = {
  type?: 'walk' | 'bike';
  justDestinations?: Boolean;
};
