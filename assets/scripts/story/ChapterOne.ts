import { StoryChapterDefinition } from './StoryTypes';

export const CHAPTER_ONE_ID = 'chapter-1-first-oracle';
export const XIAO_SHITOU_POSITION = { x: 260, y: 20 } as const;

export const chapterOneDefinition: StoryChapterDefinition = {
  id: CHAPTER_ONE_ID,
  title: '第一章：初到大邑商',
  firstStepId: 'chapter-1-intro',
  steps: [
    {
      id: 'chapter-1-intro',
      chapterId: CHAPTER_ONE_ID,
      dialogue: [
        {
          speaker: '旁白',
          kind: 'narration',
          text: '晨雾尚未散尽，你带着老师交给你的空白卜辞册，第一次踏入大邑商。',
        },
        {
          speaker: '老师',
          text: '从今天起，你便是见习小卜官。先去找小石头，他会带你熟悉这里。',
        },
      ],
      completeOn: 'dialogue-completed',
      nextStepId: 'chapter-1-meet-xiaoshitou',
      checkpoint: true,
    },
    {
      id: 'chapter-1-meet-xiaoshitou',
      chapterId: CHAPTER_ONE_ID,
      objective: {
        title: '寻找小石头',
        detail: '沿着金色标记前进',
        targetX: XIAO_SHITOU_POSITION.x,
        targetY: XIAO_SHITOU_POSITION.y,
        targetRadius: 78,
      },
      completeOn: 'npc-reached',
      nextStepId: 'chapter-1-xiaoshitou-dialogue',
    },
    {
      id: 'chapter-1-xiaoshitou-dialogue',
      chapterId: CHAPTER_ONE_ID,
      dialogue: [
        {
          speaker: '小石头',
          text: '你就是新来的小卜官吧？我是小石头。这里每一块甲骨，都藏着先民留下的消息。',
        },
        {
          speaker: '小石头',
          text: '别急着独自去占卜。先跟我回学习堂，认一认你将遇见的第一个字。',
        },
      ],
      completeOn: 'dialogue-completed',
      nextStepId: 'chapter-1-first-lesson',
      checkpoint: true,
    },
    {
      id: 'chapter-1-first-lesson',
      chapterId: CHAPTER_ONE_ID,
      objective: {
        title: '完成第一次甲骨文学习',
        detail: '在学习堂进入复习并完成一道题',
      },
      completeOn: 'learning-completed',
      nextStepId: 'chapter-1-complete',
    },
    {
      id: 'chapter-1-complete',
      chapterId: CHAPTER_ONE_ID,
      dialogue: [
        {
          speaker: '小石头',
          text: '答得好！认字只是开始。城外、田野和来访的人，都会带来新的甲骨线索。',
        },
        {
          speaker: '提示',
          kind: 'system',
          text: '第一章完成。接下来可以自由探索殷墟，收集更多甲骨文字。',
        },
      ],
      completeOn: 'dialogue-completed',
      checkpoint: true,
    },
  ],
};
