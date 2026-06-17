import { z } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/zod.js';
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  轮回: z.coerce.number().default(1),
  日: z.coerce.number().default(1),
  剩余时间: z.coerce.number().min(0).max(5).default(5),
  POWER: z.coerce.number().min(0).max(999).default(100),
  金钱: z.coerce.number().min(0).default(500),
  位置: z.string().default('断头台城 · 中央广场'),
  曲风: z.enum(['none', '活泼', '硬汉', '轻快']).default('none'),
  核心任务已解决: z.boolean().default(false),
  梅卡妮可_好感度: z.coerce.number().min(0).max(100).default(42),
  梅卡妮可_忠诚心: z.coerce.number().min(0).max(100).default(88),
});

$(() => {
  registerMvuSchema(Schema);
});
