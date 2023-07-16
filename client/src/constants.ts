export type ChallengeSpec = {
  id: string;
  imgUrl: string;
  pricing: 'Premium' | 'Free';
  title: string;
  numOfParticipants: number;
  deadline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  type: string;
};

export const challenges: ChallengeSpec[] = [
  {
    id: 'ramen',
    imgUrl: '/images/challenges/ramen.jpg',
    pricing: 'Premium',
    title: 'Ramen',
    numOfParticipants: 23,
    deadline: 'Soon',
    difficulty: 'Easy',
    type: 'competitive',
  },
  {
    id: 'travel',
    imgUrl: '/images/challenges/travel.jpg',
    pricing: 'Premium',
    title: 'Travel 5 cities',
    numOfParticipants: 236,
    deadline: 'Soon',
    difficulty: 'Hard',
    type: 'creative',
  },
  {
    id: 'dashes',
    imgUrl: '/images/challenges/dashes.jpg',
    pricing: 'Free',
    title: 'Dash rain',
    numOfParticipants: 5,
    deadline: 'Soon',
    difficulty: 'Medium',
    type: 'creative',
  },
  {
    id: 'wolf',
    imgUrl: '/images/challenges/wolf.jpg',
    pricing: 'Premium',
    title: 'Howling wolf',
    numOfParticipants: 66,
    deadline: 'Soon',
    difficulty: 'Expert',
    type: 'creative',
  },
  {
    id: 'sea_scape',
    imgUrl: '/images/challenges/sea_scape.webp',
    pricing: 'Free',
    title: 'Sea',
    numOfParticipants: 43,
    deadline: '7/28/2023, 6:28:11 PM',
    difficulty: 'Expert',
    type: 'competitive',
  },
  {
    id: 'alien',
    imgUrl: '/images/challenges/alien.png',
    pricing: 'Premium',
    title: 'Alien',
    numOfParticipants: 13,
    deadline: '8/12/2023, 4:48:49 AM',
    difficulty: 'Easy',
    type: 'competitive',
  },
  {
    id: 'leaves',
    imgUrl: '/images/challenges/leaves.jpg',
    pricing: 'Free',
    title: 'Leaves',
    numOfParticipants: 3,
    deadline: '8/15/2023, 5:25:31 PM',
    difficulty: 'Medium',
    type: 'competitive',
  },
  {
    id: 'paris',
    imgUrl: '/images/challenges/paris.jpg',
    pricing: 'Premium',
    title: 'Paris night',
    numOfParticipants: 982,
    deadline: 'Soon',
    difficulty: 'Expert',
    type: 'creative',
  },
  {
    id: 'car',
    imgUrl: '/images/challenges/car.jpg',
    pricing: 'Free',
    title: 'AUDI',
    numOfParticipants: 523,
    deadline: '8/16/2023, 12:04:47 PM',
    difficulty: 'Hard',
    type: 'competitive',
  },
  {
    id: 'mouth',
    imgUrl: '/images/challenges/mouth.png',
    pricing: 'Premium',
    title: 'Mouth',
    numOfParticipants: 236,
    deadline: '8/18/2023, 10:18:17 PM',
    difficulty: 'Easy',
    type: 'competitive',
  },
  {
    id: 'city_street_map',
    imgUrl: '/images/challenges/city_street_map.jpg',
    pricing: 'Free',
    title: 'Make a map of your city',
    numOfParticipants: 36,
    deadline: '8/18/2023, 10:18:17 PM',
    difficulty: 'Hard',
    type: 'creative',
  },
  {
    id: 'mountain',
    imgUrl: '/images/challenges/mountain.jpg',
    pricing: 'Free',
    title: 'Mountains',
    numOfParticipants: 4,
    deadline: '8/2/2023, 10:36:42 AM',
    difficulty: 'Easy',
    type: 'competitive',
  },
  {
    id: 'moth',
    imgUrl: '/images/challenges/moth.jpg',
    pricing: 'Free',
    title: 'Moth',
    numOfParticipants: 63,
    deadline: '8/26/2023, 10:02:56 PM',
    difficulty: 'Easy',
    type: 'competitive',
  },
  {
    id: '5km',
    imgUrl: '/images/challenges/5km.png',
    pricing: 'Free',
    title: 'Run 5 km',
    numOfParticipants: 73,
    deadline: '8/4/2023, 7:41:32 PM',
    difficulty: 'Medium',
    type: 'creative',
  },
  {
    id: 'tree_easy',
    imgUrl: '/images/challenges/tree_easy.jpg',
    pricing: 'Free',
    title: 'Tree simple',
    numOfParticipants: 78,
    deadline: '8/5/2023, 1:42:01 PM',
    difficulty: 'Easy',
    type: 'competitive',
  },
  {
    id: 'tree_difficult',
    pricing: 'Free',
    imgUrl: '/images/challenges/tree_difficult.jpg',
    title: 'Tough tree',
    numOfParticipants: 248,
    deadline: '8/6/2023, 5:16:35 AM',
    difficulty: 'Hard',
    type: 'competitive',
  },
  {
    id: 'tree_hard',
    pricing: 'Premium',
    title: 'Detailed tree',
    imgUrl: '/images/challenges/tree_hard.jpg',
    numOfParticipants: 3,
    deadline: '9/3/2023, 3:14:20 PM',
    difficulty: 'Expert',
    type: 'competitive',
  },
  {
    id: 'tree_expert',
    imgUrl: '/images/challenges/tree_expert.jpg',
    pricing: 'Premium',
    title: 'TreeXpert',
    numOfParticipants: 5667,
    deadline: '9/4/2023, 12:16:46 PM',
    difficulty: 'Expert',
    type: 'competitive',
  },
  {
    id: 'tree_medium',
    imgUrl: '/images/challenges/tree_medium.webp',
    pricing: 'Free',
    title: 'Tree OK',
    numOfParticipants: 346,
    deadline: '9/5/2023, 8:58:38 AM',
    difficulty: 'Easy',
    type: 'competitive',
  },
];
