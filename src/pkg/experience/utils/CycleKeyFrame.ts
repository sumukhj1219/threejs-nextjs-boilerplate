export type Cycles = "day" | "afternoon" | "dusk";

export type CycleKeys = {
    x: number;
    y: number;
    z: number;
    color: string;
    topSkyColor: string;
    bottomSkyColor: string;
    elapsed: number;
    sunIntensity: number;
};

export type CyclesKeyFrame = Record<Cycles, CycleKeys>;

export const cyclesKeyFrame: CyclesKeyFrame = {
    day: {
        x: 20,
        y: 50,
        z: 10,
        color: "#ffffff",
        topSkyColor: "#87CEEB",      
        bottomSkyColor: "#E6F6FF",
        sunIntensity: 3.0,
        elapsed: 300000,
    },

    afternoon: {
        x: -10,
        y: 30,
        z: 20,
        color: "#fdfbd3",
        topSkyColor: "#4DA8FF",      
        bottomSkyColor: "#FFECC7",  
        sunIntensity: 2.5,
        elapsed: 600000,
    },

    dusk: {
        x: -20,
        y: 10,
        z: 10,
        color: "#ffad60",
        topSkyColor: "#FF7E5F",      
        bottomSkyColor: "#FEB47B",  
        sunIntensity: 0.8,
        elapsed: 900000,
    }
};
