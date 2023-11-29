import * as fs from 'fs';
import * as path from 'path';

export function generateID(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    var length = 10;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}


export  function getRoles(location: string): string[] {
    const filepath: string = './Locations/';
  
    try {
        const data: string = fs.readFileSync(filepath + location, 'utf-8');
        const roles: string[] = data.split('\n');
        return roles;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
  }
  
 export function loadLocations(): string[] {
    const absolutePath: string = path.join(__dirname, './Locations');
  
    try {
        const files: string[] = fs.readdirSync(absolutePath);
        return files;
    } catch (error) {
        console.log("couldnt find locations directory creating it now");
        fs.mkdirSync("./Locations");
        return [];
    }
  }
  
 export function getRandomChoice<T>(array: T[]): T | string {
    if (array.length === 0) {
        return '';
    }
  
    const randomIndex: number = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  
  export function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = array.slice();
  
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    return shuffledArray;
  }