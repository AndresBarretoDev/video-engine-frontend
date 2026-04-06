import { z } from 'zod';

export const AudioTrackSchema = z.object({
  src: z.string().url(),
  volume: z.number().min(0).max(1).default(1),
  fadeInDuration: z.number().int().min(0).default(0),
  fadeOutDuration: z.number().int().min(0).default(0),
  startFrom: z.number().int().min(0).default(0),
  loop: z.boolean().default(false)
});

export type AudioTrackProps = z.infer<typeof AudioTrackSchema>;
