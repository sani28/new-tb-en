export type TourId = 'tour01' | 'tour02' | 'tour04';

export interface BoardingNotice {
  iconType: 'users' | 'clock';
  lines: string[];
  tip?: string;
}

export interface FeatureItem {
  iconType: 'utensils' | 'walking' | 'cloud-rain' | 'sun' | 'snowflake' | 'camera' | 'thermometer' | 'moon' | 'map';
  text: string;
}

export interface Highlight {
  before?: string;
  bold: string;
  after?: string;
  note?: string[]; // optional structured sub-lines rendered below the main text
}

export interface TourData {
  id: TourId;
  label: string;
  shortLabel: string;
  accentColor: string;
  accentDark?: string;   // darker variant for text on light backgrounds
  textOnAccent: 'white' | 'dark';
  badgeBg: string;
  badgeText: 'white' | 'dark';
  courseType: string;
  schedule: string;
  headerImage: string;
  carouselImages: string[];
  overview: string;
  highlights: Highlight[];
  boardingNotices: BoardingNotice[];
  busRules: FeatureItem[];
  tourTips: FeatureItem[];
  tipsTitle: string;
  timetableImage?: string;
  mapNotification?: string;
}

export const TOURS: TourData[] = [
  {
    id: 'tour01',
    label: 'Downtown Namsan Palace Course',
    shortLabel: 'Tour 01',
    accentColor: '#001E53',
    textOnAccent: 'white',
    badgeBg: '#E20021',
    badgeText: 'white',
    courseType: 'Hop On, Hop Off',
    schedule: 'First Bus: 9:20 | Last Bus: 16:50',
    headerImage: '/imgs/t1.png',
    carouselImages: ['/imgs/bc.png', '/imgs/tour01.png', '/imgs/tour01home.png', '/imgs/tour01__.png'],
    overview:
      'The Downtown Palace Namsan Course is a course that circulates through major tourist attractions in Seoul, such as N Seoul Tower, Myeong-dong, Namsangol Hanok Village, Changdeokgung Palace, Insa-dong, Blue House, and Gyeongbokgung Palace, and allows you to see the beautiful city of Seoul in harmony with the downtown, ancient palaces, and Namsan Mountain. You can get off at the desired stop and take the next bus after your tour.',
    highlights: [
      {
        before: 'If you take Downtown Palaces Namsan Course and return to the Gwanghwamun Stop without getting off at any stop, it will take about',
        bold: '1 hour and 30 minutes.',
      },
      {
        before: 'To view the inside of the',
        bold: 'Blue House (Cheongwadae)',
        after: ', you must make an individual reservation through the Blue House website. The bus will drop you off at the stop located in front of the Blue House.',
      },
      {
        before: 'The Downtown Palaces Namsan course (TOUR01) is a',
        bold: 'circulating course',
        after: ', so you can use it at a free and convenient time.',
      },
    ],
    boardingNotices: [
      {
        iconType: 'users',
        lines: ['To ensure a smooth boarding process, please collect your boarding pass at least 30 minutes before departure.'],
      },
      {
        iconType: 'clock',
        lines: ['Vehicle arrival time may be delayed due to demonstrations, events, traffic congestion, etc.'],
      },
    ],
    busRules: [
      { iconType: 'utensils', text: 'Coffee, beverages, and food are not allowed in the bus.' },
      { iconType: 'walking', text: 'Standing is not allowed on the 2nd floor of the open-top double-decker bus.' },
      { iconType: 'cloud-rain', text: 'The roof of any open-top bus can be opened and closed, so we can operate normally even on rainy or snowy days.' },
    ],
    tourTips: [
      { iconType: 'sun', text: 'In Spring/Summer, UV rays are strong, so it is recommended to prepare a hat, sunscreen, or sunglasses.' },
      { iconType: 'snowflake', text: "In Fall/Winter, it can be quite cold so it's good to prepare a hat, outerwear, blanket, or hand warmers." },
    ],
    tipsTitle: 'SEASONAL TIPS',
    timetableImage: '/imgs/tour01-timetable-en.png',
  },
  {
    id: 'tour02',
    label: 'Panorama Course',
    shortLabel: 'Tour 02',
    accentColor: '#C41E3A',
    textOnAccent: 'white',
    badgeBg: '#7A0019',
    badgeText: 'white',
    courseType: 'Hop On, Hop Off',
    schedule: 'Departure: See timetable | Duration: See timetable',
    headerImage: '/imgs/panorama.png',
    carouselImages: ['/imgs/panorama.png', '/imgs/tour02__.png'],
    overview:
      "The Panorama Course is designed for classic sightseeing and big-city views—ride across Seoul's most iconic areas and enjoy a scenic, photo-friendly route. Perfect for first-time visitors who want a memorable overview of the city in one course.",
    highlights: [
      { before: 'Enjoy', bold: 'wide-angle city scenery and skyline moments', after: 'along the route.' },
      { before: 'A great option for', bold: 'first-time visitors', after: 'who want an overview of Seoul.' },
      { before: 'Comfortable ride with', bold: 'easy photo opportunities', after: 'throughout the course.' },
    ],
    boardingNotices: [
      {
        iconType: 'users',
        lines: ['All seats are unassigned.', 'Boarding is on a first-come, first-served basis.'],
        tip: '*It is recommended to arrive early as this tour is very popular and can sell out quickly.',
      },
      {
        iconType: 'clock',
        lines: ['Please arrive at least 15 minutes before the scheduled departure time.'],
      },
    ],
    busRules: [
      { iconType: 'utensils', text: 'Coffee, beverages, and food are not allowed in the bus.' },
      { iconType: 'camera', text: 'Bring your camera — this route offers great photo opportunities along scenic viewpoints.' },
      { iconType: 'thermometer', text: 'Dress comfortably for the weather. Open-top sections can be cool depending on the season.' },
    ],
    tourTips: [
      { iconType: 'sun', text: 'The best views are enjoyed on clear days. Tours operate in most weather conditions.' },
      { iconType: 'map', text: 'This is a hop-on, hop-off course — feel free to explore stops at your own pace.' },
    ],
    tipsTitle: 'TOUR TIPS',
  },
  {
    id: 'tour04',
    label: 'Night View Course',
    shortLabel: 'Tour 04',
    accentColor: '#FFCC00',
    accentDark: '#7A5C00',
    textOnAccent: 'dark',
    badgeBg: '#000000',
    badgeText: 'white',
    courseType: 'Non Stop Course',
    schedule: 'Departure: 19:30 | Duration: 2 hours',
    headerImage: '/imgs/tour04_bus.png',
    carouselImages: ['/imgs/tour04.png', '/imgs/tour04home.png', '/imgs/tour04_bus.png'],
    overview:
      "The Night View Course is a special evening tour that takes you to see Seoul's most beautiful night landscapes. Experience the sparkling Han River bridges, the cityscape from N Seoul Tower, and the vibrant nighttime atmosphere of Korea's capital. Enjoy a memorable 2-hour journey through Seoul after dark with photo opportunities at iconic locations.",
    highlights: [
      { bold: 'The Night View Course departs once a day,', after: 'and boarding is available 40 minutes before departure.' },
      { bold: 'You will have 20 to 30 minutes at N Seoul Tower', after: 'to freely enjoy the night view and relax.' },
      {
        bold: 'Han River Namsan Night Tour Departure Time',
        note: ['Departure: 19:00', 'From May to August: 19:30'],
      },
    ],
    boardingNotices: [
      {
        iconType: 'users',
        lines: ['All seats are unassigned.', 'Boarding is on a first-come, first-served basis.'],
        tip: '*It is recommended to arrive early as the night tour is very popular and can sell out quickly.',
      },
      {
        iconType: 'clock',
        lines: ['Please arrive at least 15 minutes before departure time (19:15) as the night tour departs promptly at 19:30.'],
      },
    ],
    busRules: [
      { iconType: 'utensils', text: 'Coffee, beverages, and food are not allowed in the bus.' },
      { iconType: 'camera', text: 'Bring your camera for the 30-minute photo opportunity at N Seoul Tower.' },
      { iconType: 'thermometer', text: 'Evenings can be cool, especially in spring and fall, so a light jacket is recommended.' },
    ],
    tourTips: [
      { iconType: 'moon', text: 'The best views are on clear nights. Tours may be adjusted during heavy rain or poor visibility.' },
      { iconType: 'map', text: 'This is a non-stop guided tour with a set itinerary. There is no hop-on, hop-off option.' },
    ],
    tipsTitle: 'TOUR TIPS',
    mapNotification:
      'The Night View Course departure time:\nFrom January 01st to April 15th: Departure at 19:00\nFrom April 16th to September 15th: Departure at 19:30\nFrom September 16th to December 31st: Departure at 19:00',
  },
];
