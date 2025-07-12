
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target } from 'lucide-react';

interface BestPlayerProps {
  visible: boolean;
}

const BestPlayer = ({ visible }: BestPlayerProps) => {
  if (!visible) return null;

  // Mock data - in a real app this would come from props or context
  const playerData = {
    name: "Player Alpha",
    score: 1247,
    level: 8,
    achievements: 12,
    accuracy: 94.5
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <Card className="w-64 bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Best Player
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{playerData.name}</span>
            <Badge variant="secondary" className="font-semibold">
              Level {playerData.level}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                Score
              </span>
              <span className="font-mono font-semibold">{playerData.score.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4 text-blue-500" />
                Accuracy
              </span>
              <span className="font-mono font-semibold">{playerData.accuracy}%</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Achievements</span>
              <Badge variant="outline" className="text-xs">
                {playerData.achievements}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BestPlayer;
