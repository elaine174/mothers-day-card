import type { AiTextStyle } from '@/types';

// ============================================================
// AI 文案模組
// ============================================================

const textPools: Record<AiTextStyle, string[]> = {
  gentle: [
    '媽媽，謝謝妳一直默默守護著我們。有妳在的地方，才是真正的家。母親節快樂。',
    '謝謝妳總是把最好的留給我，妳的愛我一直都記得。祝媽媽節日快樂、幸福。',
    '媽，因為有妳，我才有勇氣面對這個世界。謝謝妳，節日快樂，要健康喔。',
    '媽媽，妳的溫柔與包容是我最深的記憶，謝謝妳多年來的陪伴，節日快樂。',
  ],
  casual: [
    '媽～今天是妳的節日，妳最大！謝謝妳一直愛我，我也超愛妳的，快樂喔！',
    '欸媽，節日快樂！每次覺得累了想到妳就好一點，謝謝妳永遠都在那裡！',
    '媽！特別做了這張卡片給妳，希望妳今天吃好睡好，開心最重要！愛妳。',
    '阿媽～要健康喔！謝謝妳每次都默默支持我，妳真的超棒的！節日快樂。',
  ],
  cute: [
    '媽咪媽咪！今天是妳的特別日子🌸 謝謝妳做的一切，妳是宇宙最好的媽媽！',
    '媽媽大人～感謝娘親多年照顧之恩，兒女銘記五內！祝節日快樂身體健康🎀',
    '媽咪！做了張卡片送給妳🎁 因為妳是世界最棒的媽媽，要健康快樂喔！',
    '麻麻🥺 謝謝妳愛我這個有時候很煩的小孩，我超愛妳的！母親節快樂💓',
  ],
};

// ============================================================
// 主題分類祝福語
// ============================================================

export type BlessingTheme = 'all' | 'warm' | 'humor' | 'poetic';

export const THEMED_BLESSINGS: Record<Exclude<BlessingTheme, 'all'>, string[]> = {
  warm: [
    '媽，謝謝妳一直默默付出、陪著我長大。願妳每天開心平安，母親節快樂。',
    '謝謝妳總是把最好的留給我，妳卻從不說辛苦。媽，我知道，謝謝妳，愛妳。',
    '媽媽，有妳的地方就是家。謝謝妳的溫柔與包容，祝妳母親節快樂、身體健康。',
    '妳的愛是我最大的勇氣，謝謝妳，媽。希望妳每天笑得開心，健康快樂。',
    '謝謝妳總是默默守護著我，讓我不論何時回頭都有溫暖的地方，母親節快樂。',
    '媽，妳是我最想告訴一切的人。謝謝妳一直都在，節日快樂，要健康快樂。',
    '謝謝妳的陪伴讓我不曾真正孤單過。媽，我愛妳，祝妳母親節平安幸福。',
    '謝謝妳在我跌倒時靜靜等我站起來，不多說什麼。媽，我愛妳，謝謝妳。',
    '媽媽，有妳的日子是我最幸運的事，謝謝妳，母親節快樂，要開心喔！',
    '媽，不管走多遠，最想回的地方都是有妳的家。謝謝妳，節日快樂。',
    '媽媽，謝謝妳在我最迷茫時沒有催我，只是靜靜陪著我，母親節快樂。',
    '謝謝妳接受我所有奇怪的決定還默默支持我，妳最棒了，母親節快樂。',
    '媽，謝謝妳不管我長多大還是把我當寶貝，妳的愛讓我好安心，節日快樂。',
    '媽媽，每次看到妳的來電就知道有人在想我，謝謝妳，節日快樂要健康。',
    '謝謝妳把家打理得這麼好，讓我隨時都有可以好好休息的地方，節日快樂。',
    '媽，妳付出的每一份心意我都記得，謝謝妳從不要求回報，我愛妳，快樂。',
    '每次妳說「沒事就好」，我都覺得好幸福，謝謝妳一直這樣愛我，媽，快樂。',
  ],
  humor: [
    '媽，妳說嫁雞隨雞，但我覺得最幸運的是做妳的小孩，謝謝妳，節日快樂！',
    '媽，今天所有家事都不用做，就讓我來！（好，明天再說）母親節快樂。',
    '長大後才明白，妳當年說的「為你好」每一句都是真的。謝謝妳，媽，快樂。',
    '媽，謝謝妳不說「我早就說了」，讓我自己慢慢學著長大，謝謝妳的包容。',
    '媽！特別做了這張卡片，希望妳今天吃好睡好，其他的明天再說，快樂喔！',
    '媽，雖然我有時候很煩，但我永遠是妳最愛的那個孩子對嗎？母親節快樂！',
    '每次說「隨便」結果都有意見的是我，每次說「沒關係」都有在擔心的是妳。謝謝妳媽。',
    '妳說不需要什麼禮物，但今天這張卡片妳一定要收下！媽，母親節快樂愛妳。',
    '媽，工作再忙也記得好好休息，妳健健康康是我最大的心願，節日快樂。',
    '謝謝妳在我最不可愛的年紀還這麼愛我，這一點真的很了不起，媽，快樂。',
    '媽，我知道妳最擔心的是我吃飽了沒，今天吃飽了！母親節快樂，愛妳。',
    '媽，妳教我的事後來都用上了，只是沒跟妳說。謝謝妳，節日快樂。',
    '阿媽！今天不催我睡覺可以嗎？開玩笑的，謝謝妳一直關心我，節日快樂。',
    '媽，妳說不用買禮物，但我偏不聽，這張卡片就是禮物，母親節快樂！',
    '最近身體怎樣？記得多喝水喔！（我知道我在學妳）媽，母親節快樂愛妳。',
    '謝謝妳每次都假裝沒看到我的糗事，讓我保留面子，媽，妳真的很厲害。',
    '媽，我這輩子做得最對的事情之一，就是有妳當我媽，節日快樂！',
  ],
  poetic: [
    '妳笑起來的樣子是我最珍貴的風景，媽，要一直幸福下去，母親節快樂。',
    '每次打電話，妳都先問「吃飽了嗎」，那四個字是我最深的安慰。謝謝妳媽。',
    '在外面累了，最想回家，就是最想到妳。媽媽謝謝妳，母親節快樂健康。',
    '媽媽，妳是讓我覺得世界很溫暖的原因，謝謝妳，祝妳節日快樂幸福。',
    '妳的電話是我每次遇到難關最想撥的號碼，謝謝妳，媽，母親節快樂。',
    '媽媽，每次回家看到妳煮的菜，再累都好了。謝謝妳，節日快樂要健康。',
    '媽媽長大後才懂妳說的那些嘮叨全是愛。謝謝妳，我愛妳，母親節快樂。',
    '謝謝妳把最好的都給了我，妳卻說這是理所當然。媽，從來都不是的，謝謝。',
    '妳是我認識最久、最愛的人，也是我最想好好照顧的人。媽，母親節快樂。',
    '媽媽，妳把家照顧得這麼好，讓我不論多晚回來都覺得安心，謝謝妳。',
    '謝謝妳生了我、養了我，更謝謝妳這麼愛我，媽，母親節快樂。',
    '妳說「不用謝」，但我偏要說謝謝妳，媽媽，謝謝妳愛我，母親節快樂。',
    '媽，長大後才懂妳說的「沒事就好」是妳給我最深的愛，謝謝妳。',
    '妳總是輕描淡寫說「還好啦」，但我知道妳做了多少，謝謝妳，媽，快樂。',
    '媽媽，妳是那個讓我不管走多遠都想回來的理由，謝謝妳，節日快樂。',
    '妳的聲音是我最熟悉的聲音，也是最讓我安心的聲音，媽，母親節快樂。',
    '謝謝妳總是用行動告訴我愛是什麼，媽媽，我想向妳學習，節日快樂。',
  ],
};

// 合併所有主題為一個大池
export const REALISTIC_BLESSINGS: string[] = [
  ...THEMED_BLESSINGS.warm,
  ...THEMED_BLESSINGS.humor,
  ...THEMED_BLESSINGS.poetic,
];

const lastIdxByTheme: Record<BlessingTheme, number> = { all: -1, warm: -1, humor: -1, poetic: -1 };

export function getRandomBlessing(theme: BlessingTheme = 'all'): string {
  const pool = theme === 'all' ? REALISTIC_BLESSINGS : THEMED_BLESSINGS[theme];
  let idx: number;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (idx === lastIdxByTheme[theme] && pool.length > 1);
  lastIdxByTheme[theme] = idx;
  return pool[idx];
}

/**
 * 依文字長度推算最佳字型大小
 */
export function calcAutoFontSize(text: string): number {
  const len = text.length;
  if (len <= 18) return 17;
  if (len <= 28) return 16;
  if (len <= 45) return 15;
  if (len <= 58) return 14;
  return 12;
}

export const DEFAULT_BLESSING_TEXT = '媽媽，謝謝妳一直以來的照顧與陪伴，母親節快樂。';
export const DEFAULT_SHARE_TEXT = '媽～母親節快樂 ❤️ 這張卡片是我做給妳的！';

export function getAiText(style: AiTextStyle): string {
  const pool = textPools[style];
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function mockAiRewrite(originalText: string, style: AiTextStyle): Promise<string> {
  const delay = 800 + Math.random() * 700;
  await new Promise((resolve) => setTimeout(resolve, delay));
  if (originalText.trim().length < 5) return getAiText(style);
  const prefixes: Record<AiTextStyle, string> = { gentle: '媽媽，', casual: '媽～', cute: '媽咪！' };
  const suffixes: Record<AiTextStyle, string> = { gentle: '謝謝妳，母親節快樂。', casual: '母親節快樂！❤️', cute: '母親節超級快樂！💕' };
  const coreText = originalText.replace(/^媽媽[，,、]?/, '').replace(/^媽[～~]?/, '').replace(/母親節快樂[。！!]?$/, '').trim();
  if (coreText.length === 0) return getAiText(style);
  return `${prefixes[style]}${coreText}，${suffixes[style]}`;
}

export const aiStyleButtons = [
  { style: 'gentle' as AiTextStyle, label: '溫柔版', icon: '🌸', description: '溫暖細膩', color: '#FF91B8', bgColor: '#FFF0F5' },
  { style: 'casual' as AiTextStyle, label: '日常版', icon: '💬', description: '輕鬆自然', color: '#A78BFA', bgColor: '#F5F3FF' },
  { style: 'cute'   as AiTextStyle, label: '可愛版', icon: '🤖', description: '俏皮可愛', color: '#34D399', bgColor: '#F0FDF4' },
];
