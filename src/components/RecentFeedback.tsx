'use client';

import { useEffect, useState } from 'react';
import { getRecentFeedback } from '@/lib/firestore';
import { Feedback } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RecentFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getRecentFeedback(5);
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching recent feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const getSentimentVariant = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No feedback yet</p>
          ) : (
            feedback.map((item) => (
              <div key={item.id} className="border-l-4 pl-4" style={{ borderLeftColor: '#8b5cf6' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.rating && (
                      <span className="text-lg">
                        {item.rating === 1 ? '😞' : item.rating === 2 ? '😐' : item.rating === 3 ? '😍' : '⭐'.repeat(item.rating)}
                      </span>
                    )}
                    {item.sentiment && (
                      <Badge variant={getSentimentVariant(item.sentiment)}>
                        {item.sentiment}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-foreground text-sm line-clamp-2">
                  {item.content}
                </p>
                {item.category && (
                  <Badge variant="outline" className="mt-2">
                    {item.category}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}