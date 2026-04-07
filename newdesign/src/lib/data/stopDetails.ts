export interface StopDetail {
  address: string;
  locationDesc: string;
  directions: string[];
  nearbyAttractions: string[];
}

// Keyed by "tourId-stopIndex" e.g. "01-0" for Tour 01 Stop 1
const STOP_DETAILS: Record<string, StopDetail> = {
  "01-0": {
    address: "63-1 Taepyeong-ro 1-ga, Jung-gu, Seoul",
    locationDesc: "Located nearby Gwanghwamun Station Intersection, Dongwha Duty Free Shop, Koreana Hotel",
    directions: [
      "Subway line 5 Gwanghwamun Station Exit 6, 100m walk",
      "Subway lines 1, 2 City Hall Station Exit 3, 300m walk",
    ],
    nearbyAttractions: ["Seoul Plaza", "Gwanghwamun Square", "Cheonggye Plaza"],
  },
  "01-1": {
    address: "67 Myeongdong-gil, Jung-gu, Seoul",
    locationDesc: "Located near Myeongdong Cathedral and Myeongdong Shopping Street",
    directions: [
      "Subway line 4 Myeongdong Station Exit 6, 200m walk",
      "Subway line 2 Euljiro 1-ga Station Exit 5, 400m walk",
    ],
    nearbyAttractions: ["Myeongdong Cathedral", "Myeongdong Shopping Street", "Lotte Department Store"],
  },
  "01-2": {
    address: "28 Toegye-ro 34-gil, Jung-gu, Seoul",
    locationDesc: "Located at Namsangol Hanok Village entrance",
    directions: [
      "Subway line 3, 4 Chungmuro Station Exit 3, 400m walk",
      "Subway line 3 Dongguk Univ. Station Exit 6, 500m walk",
    ],
    nearbyAttractions: ["Namsangol Hanok Village", "Korea House", "Namsan Park Trail"],
  },
};

export function getStopDetail(tourId: string, stopIndex: number): StopDetail | null {
  return STOP_DETAILS[`${tourId}-${stopIndex}`] ?? null;
}
