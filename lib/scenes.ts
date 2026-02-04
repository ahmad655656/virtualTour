/* =========================================================
   Scene Images (نفس الصور من الخريطة)
========================================================= */
export const sceneImages = {
  // دمشق - صور بانورامية
  entrance: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Soissons_Cathedral_Interior_360x180%2C_Picardy%2C_France_-_Diliff.jpg/1280px-Soissons_Cathedral_Interior_360x180%2C_Picardy%2C_France_-_Diliff.jpg',
  
  // حلب - قلعة حلب
  flower: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/2014-08-07_09-43-56_ouvrage-g.jpg/2560px-2014-08-07_09-43-56_ouvrage-g.jpg',
  
  // حمص - المساجد التاريخية
  fountain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/2014-12-22_13-50-56_Switzerland_Kanton_Schaffhausen_Stetten_SH_QC_360%C2%B0_5h.JPG/2560px-2014-12-22_13-50-56_Switzerland_Kanton_Schaffhausen_Stetten_SH_QC_360%C2%B0_5h.JPG',
  
  // اللاذقية - الميناء
  rest: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/2014-05-01_10-53-29_Iceland_-_M%C3%BDvatni_Reykjahl%C3%AD%C3%B0.jpg/2560px-2014-05-01_10-53-29_Iceland_-_M%C3%BDvatni_Reykjahl%C3%AD%C3%B0.jpg',
  
  // درعا - الآثار
  playground: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/2014-04-28_17-31-02_Iceland_-_M%C3%BDvatni_Reykjahl%C3%AD%C3%B0_-_Reykjahl%C3%AD%C3%B0_Airport_-_12h_360%C2%B0.jpg/2560px-2014-04-28_17-31-02_Iceland_-_M%C3%BDvatni_Reykjahl%C3%AD%C3%B0_-_Reykjahl%C3%AD%C3%B0_Airport_-_12h_360%C2%B0.jpg',
  
  // تدمر - الصحراء والأعمدة
  palmyra: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/2014-04-28_16-41-52_Iceland_-_M%C3%BDvatni_Reykjahl%C3%AD%C3%B0_-_Hverir_-_10h_360%C2%B0.jpg/2560px-2014-04-28_16-41-52_Iceland_-_M%C3%BDvatni_Reykjahl%C3%AD%C3%B0_-_Hverir_-_10h_360%C2%B0.jpg',
  
  // قلعة الحصن
  castle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/2014-04-30_13-00-46_Iceland_-_Akureyri_9h_360%C2%B0.JPG/2560px-2014-04-30_13-00-46_Iceland_-_Akureyri_9h_360%C2%B0.JPG',
  
  // الساحل السوري
  coast: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/2015-01-01_12-15-44_1029.0_Switzerland_Kanton_St._Gallen_Wildhaus_QC_6h_360.jpg/2560px-2015-01-01_12-15-44_1029.0_Switzerland_Kanton_St._Gallen_Wildhaus_QC_6h_360.jpg'
} as const;


/* =========================================================
   Type Definitions
========================================================= */
export type SceneId = 'entrance' | 'fountain' | 'rest' | 'playground' | 'flower' | 'palmyra' | 'castle' | 'coast';

export interface HotSpot {
  pitch: number;
  yaw: number;
  type: 'scene' | 'info';
  text: string;
  sceneId?: SceneId;
  content?: string;
}

export interface SceneInfo {
  history?: string;
  features?: string[];
  bestTime?: string;
  tips?: string[];
}

export interface Scene {
  id: SceneId;
  title: string;
  description: string;
  imageUrl: string;
  hotSpots?: HotSpot[];
  audioUrl?: string;
  info?: SceneInfo;
}

/* =========================================================
   Hotspots Configuration
========================================================= */
export const sceneHotspots: Record<SceneId, HotSpot[]> = {
  entrance: [
    {
      pitch: -10,
      yaw: 30,
      type: 'info',
      text: 'معلومات دمشق',
      content: 'دمشق أقدم عاصمة مأهولة في العالم، تُلقب بمدينة الياسمين.'
    },
    {
      pitch: 5,
      yaw: 120,
      type: 'scene',
      text: 'الانتقال إلى حلب',
      sceneId: 'flower'
    }
  ],
  flower: [
    {
      pitch: 5,
      yaw: 45,
      type: 'info',
      text: 'معلومات حلب',
      content: 'حلب أكبر مدينة في سوريا، قلعتها مدرجة في قائمة التراث العالمي.'
    },
    {
      pitch: -8,
      yaw: 180,
      type: 'scene',
      text: 'الانتقال إلى حمص',
      sceneId: 'fountain'
    }
  ],
  fountain: [
    {
      pitch: 8,
      yaw: 0,
      type: 'info',
      text: 'معلومات حمص',
      content: 'نوافير مائية تاريخية في مدينة حمص، ثالث أكبر مدينة في سوريا.'
    },
    {
      pitch: -5,
      yaw: 270,
      type: 'scene',
      text: 'الانتقال إلى اللاذقية',
      sceneId: 'rest'
    }
  ],
  rest: [
    {
      pitch: -10,
      yaw: 40,
      type: 'info',
      text: 'معلومات اللاذقية',
      content: 'منتزهات ساحلية على البحر المتوسط، تشتهر بالمأكولات البحرية.'
    },
    {
      pitch: 0,
      yaw: 140,
      type: 'scene',
      text: 'الانتقال إلى درعا',
      sceneId: 'playground'
    }
  ],
  playground: [
    {
      pitch: 6,
      yaw: 180,
      type: 'info',
      text: 'معلومات درعا',
      content: 'منطقة تاريخية تعود للعصر الحجري، تشتهر بالزراعة وخاصة الزيتون.'
    },
    {
      pitch: -12,
      yaw: 310,
      type: 'scene',
      text: 'الانتقال إلى تدمر',
      sceneId: 'palmyra'
    }
  ],
  palmyra: [
    {
      pitch: 0,
      yaw: 0,
      type: 'info',
      text: 'معلومات تدمر',
      content: 'مدينة تدمر أثرية تعود للقرن الثاني الميلادي، موقع تراث عالمي.'
    },
    {
      pitch: -5,
      yaw: 120,
      type: 'scene',
      text: 'الانتقال إلى قلعة الحصن',
      sceneId: 'castle'
    }
  ],
  castle: [
    {
      pitch: 15,
      yaw: 0,
      type: 'info',
      text: 'معلومات قلعة الحصن',
      content: 'قلعة الحصن من أفضل القلاع الصليبية المحفوظة، بنيت في القرن الحادي عشر.'
    },
    {
      pitch: -5,
      yaw: 90,
      type: 'scene',
      text: 'الانتقال إلى الساحل',
      sceneId: 'coast'
    }
  ],
  coast: [
    {
      pitch: -5,
      yaw: 0,
      type: 'info',
      text: 'معلومات الساحل',
      content: 'الساحل السوري بطول 183 كيلومتر، يطل على البحر الأبيض المتوسط.'
    },
    {
      pitch: 8,
      yaw: 180,
      type: 'scene',
      text: 'العودة إلى دمشق',
      sceneId: 'entrance'
    }
  ]
};

/* =========================================================
   Scene Extra Information
========================================================= */
export const sceneInfo: Record<SceneId, SceneInfo> = {
  entrance: {
    history: 'دمشق أقدم عاصمة مأهولة في العالم، تأسست قبل أكثر من 11,000 سنة.',
    features: ['مدينة الياسمين', 'تاريخ عريق', 'مركز ثقافي'],
    bestTime: 'الربيع والخريف',
    tips: ['قم بزيارة الجامع الأموي', 'تذوق المأكولات التقليدية']
  },
  fountain: {
    history: 'حمص ثالث أكبر مدينة في سوريا، تشتهر بصناعة المنسوجات.',
    features: ['نوافير تاريخية', 'صناعة النسيج', 'مناخ متوسطي'],
    bestTime: 'أبريل-يونيو',
    tips: ['شاهد النوافير الليلية', 'تجول في الأسواق التقليدية']
  },
  rest: {
    history: 'اللاذقية الميناء الرئيسي لسوريا، تتميز بمناخ متوسطي معتدل.',
    features: ['ميناء بحري', 'مأكولات بحرية', 'منتجعات ساحلية'],
    bestTime: 'الصيف',
    tips: ['تذوق المأكولات البحرية', 'استمتع بالشواطئ الذهبية']
  },
  playground: {
    history: 'درعا بوابة سوريا الجنوبية، منطقة تاريخية تعود للعصر الحجري.',
    features: ['زراعة الزيتون', 'آثار تاريخية', 'مناخ دافئ'],
    bestTime: 'الربيع',
    tips: ['زراعة الزيتون التقليدية', 'زيارة الآثار التاريخية']
  },
  flower: {
    history: 'حلب أكبر مدينة في سوريا، قلعتها مدرجة في التراث العالمي لليونسكو.',
    features: ['قلعة حلب', 'صابون الغار', 'أسواق تاريخية'],
    bestTime: 'أكتوبر-أبريل',
    tips: ['زيارة قلعة حلب', 'شراء الصابون التقليدي']
  },
  palmyra: {
    history: 'مدينة تدمر أثرية تعود للقرن الثاني الميلادي، موقع تراث عالمي.',
    features: ['أعمدة تدمر', 'معبد بل', 'المسرح الروماني'],
    bestTime: 'مارس-مايو',
    tips: ['زيارة الآثار عند الغروب', 'احمل الماء والواقي الشمسي']
  },
  castle: {
    history: 'قلعة الحصن بنيت في القرن الحادي عشر، من أفضل القلاع الصليبية المحفوظة.',
    features: ['تصميم دفاعي فريد', 'أبراج مراقبة', 'قاعات تاريخية'],
    bestTime: 'الربيع والخريف',
    tips: ['استكشاف الأبراج', 'التقاط صور بانورامية']
  },
  coast: {
    history: 'الساحل السوري بطول 183 كيلومتر، يشتهر برماله الذهبية.',
    features: ['شواطئ ذهبية', 'رياضات مائية', 'منتجعات سياحية'],
    bestTime: 'يونيو-سبتمبر',
    tips: ['السباحة في البحر المتوسط', 'ممارسة الرياضات المائية']
  }
};

/* =========================================================
   Optional Ambient Audio
========================================================= */
export const sceneAudio: Record<SceneId, string> = {
  entrance: 'https://assets.mixkit.co/sfx/preview/mixkit-market-bustle-1278.mp3',
  fountain: 'https://assets.mixkit.co/sfx/preview/mixkit-waterfall-nature-loop-1195.mp3',
  rest: 'https://assets.mixkit.co/music/preview/mixkit-seaside-serenity-737.mp3',
  playground: 'https://assets.mixkit.co/sfx/preview/mixkit-children-playing-happily-2498.mp3',
  flower: 'https://assets.mixkit.co/sfx/preview/mixkit-birds-in-the-jungle-2436.mp3',
  palmyra: 'https://assets.mixkit.co/music/preview/mixkit-desert-wind-1156.mp3',
  castle: 'https://assets.mixkit.co/music/preview/mixkit-medieval-fanfare-3-2284.mp3',
  coast: 'https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-loop-1194.mp3'
};

/* =========================================================
   Constants: Titles & Descriptions
========================================================= */
const SCENE_TITLES: Record<SceneId, string> = {
  entrance: 'دمشق',
  fountain: 'حمص',
  rest: 'اللاذقية',
  playground: 'درعا',
  flower: 'حلب',
  palmyra: 'تدمر',
  castle: 'قلعة الحصن',
  coast: 'الساحل السوري'
};

const SCENE_DESCRIPTIONS: Record<SceneId, string> = {
  entrance: 'أقدم عاصمة مأهولة في العالم',
  fountain: 'مدينة النواعير والمنسوجات',
  rest: 'ميناء سوريا الرئيسي',
  playground: 'بوابة سوريا الجنوبية',
  flower: 'أكبر مدينة في سوريا',
  palmyra: 'موقع تراث عالمي',
  castle: 'قلعة صليبية تاريخية',
  coast: 'شواطئ البحر المتوسط'
};

/* =========================================================
   Factory: Create Complete Scenes
========================================================= */
export const createCompleteScenes = (): Scene[] => {
  const sceneIds: SceneId[] = ['entrance', 'flower', 'fountain', 'rest', 'playground', 'palmyra', 'castle', 'coast'];
  
  return sceneIds.map((id) => ({
    id,
    title: SCENE_TITLES[id],
    description: SCENE_DESCRIPTIONS[id],
    imageUrl: sceneImages[id],
    hotSpots: sceneHotspots[id],
    audioUrl: sceneAudio[id],
    info: sceneInfo[id]
  }));
};

/* =========================================================
   Syria Locations for Map
========================================================= */
export const syriaLocations = [
  {
    id: 'entrance',
    name: 'دمشق',
    description: 'أقدم عاصمة مأهولة في العالم',
    position: [33.5138, 36.2765] as [number, number],
    icon: '🏛️',
    type: 'heritage',
    realImages: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvetc7-P9QGaxFI67U0rF0XGTBjbmWkmIYWQ&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGjP_e84X6uyaSkDVCtXRVVjuNYowKAGboZw&s',
    ],
    facts: [
      'دمشق أقدم عاصمة مأهولة في العالم',
      'تأسست قبل أكثر من 11,000 سنة',
      'تُلقب بمدينة الياسمين'
    ]
  },
  {
    id: 'flower',
    name: 'حلب',
    description: 'أكبر مدينة في سوريا',
    position: [36.2021, 37.1343] as [number, number],
    icon: '🌺',
    type: 'garden',
    realImages: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545243421-89e5c9b6d12c?w=800&auto=format&fit=crop'
    ],
    facts: [
      'حلب أكبر مدينة في سوريا',
      'قلعة حلب مدرجة في قائمة التراث العالمي',
      'تشتهر بصابون الغار التقليدي'
    ]
  },
  {
    id: 'fountain',
    name: 'حمص',
    description: 'مدينة النواعير والمنسوجات',
    position: [34.7324, 36.7132] as [number, number],
    icon: '⛲',
    type: 'fountain',
    realImages: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526888932495-6c7652c3504f?w=800&auto=format&fit=crop'
    ],
    facts: [
      'حمص ثالث أكبر مدينة في سوريا',
      'تشتهر بصناعة المنسوجات',
      'تتميز بمناخ البحر الأبيض المتوسط'
    ]
  },
  {
    id: 'rest',
    name: 'اللاذقية',
    description: 'ميناء سوريا الرئيسي',
    position: [35.5176, 35.7836] as [number, number],
    icon: '🌊',
    type: 'coast',
    realImages: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop'
    ],
    facts: [
      'اللاذقية الميناء الرئيسي لسوريا',
      'تشتهر بالمأكولات البحرية',
      'مناخها المتوسطي المعتدل'
    ]
  },
  {
    id: 'playground',
    name: 'درعا',
    description: 'بوابة سوريا الجنوبية',
    position: [32.6252, 36.1052] as [number, number],
    icon: '🌾',
    type: 'garden',
    realImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539391331146-884fef10c6e4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&auto=format&fit=crop'
    ],
    facts: [
      'درعا بوابة سوريا الجنوبية',
      'تشتهر بالزراعة وخاصة الزيتون',
      'منطقة تاريخية تعود للعصر الحجري'
    ]
  },
  {
    id: 'palmyra',
    name: 'تدمر',
    description: 'موقع تراث عالمي',
    position: [34.5586, 38.2839] as [number, number],
    icon: '🏛️',
    type: 'heritage',
    realImages: [
      'https://images.unsplash.com/photo-1512757776214-26d36777b513?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop'
    ],
    facts: [
      'مدينة تدمر أثرية تعود للقرن الثاني الميلادي',
      'مدرجة في قائمة التراث العالمي لليونسكو',
      'كانت مركزاً تجارياً مهماً على طريق الحرير'
    ]
  },
  {
    id: 'castle',
    name: 'قلعة الحصن',
    description: 'قلعة صليبية تاريخية',
    position: [34.7578, 36.2948] as [number, number],
    icon: '🏰',
    type: 'castle',
    realImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528834342297-fdefb9a5a92b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop'
    ],
    facts: [
      'قلعة الحصن من أفضل القلاع الصليبية المحفوظة',
      'بنيت في القرن الحادي عشر الميلادي',
      'تتميز بتصميمها الدفاعي الفريد'
    ]
  },
  {
    id: 'coast',
    name: 'الساحل السوري',
    description: 'شواطئ البحر المتوسط',
    position: [35.5176, 35.7836] as [number, number],
    icon: '🏖️',
    type: 'coast',
    realImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&auto=format&fit=crop'
    ],
    facts: [
      'يبلغ طول الساحل السوري 183 كيلومتر',
      'يطل على البحر الأبيض المتوسط',
      'تشتهر شواطئه بالرمال الذهبية'
    ]
  }
];