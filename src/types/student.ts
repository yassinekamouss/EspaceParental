import { User } from './user';

export interface Student extends User {

    grade: string;
    role: string;
    parentId: string;
    teacherId: string;
    gender: string
    playerProfile: {
        playerName: string; // to be used in the game
        gameLevel: number;
        mathLevel: number;
        coins: number;
        questionsSolved: number;
        rewardProfile: {
            score: number;
            rank: number;
            iScore: number;
            rewardCount: number;
            positives: number;
            negatives: number;
        };
    };
    achievements: string[];
    gameProgress:  {
        gameId: string;
        lastScore: number;
        bestScore: number;
        completedAt: string;
    }[];
}
