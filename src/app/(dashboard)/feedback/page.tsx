'use client';

import { useEffect, useState } from 'react';
import { getFeedback } from '@/lib/firestore';
import { Feedback } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getFeedback();
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
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

  const getPriorityVariant = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground">
            View and manage user feedback
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">
          View and manage user feedback
        </p>
      </div>

      <Card style={{ borderLeftColor: '#f97316', borderLeftWidth: '4px' }}>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {feedback.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No feedback yet</p>
            ) : (
              feedback.map((item) => (
                <Card key={item.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
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
                        {item.aiAnalysis?.priority && (
                          <Badge variant={getPriorityVariant(item.aiAnalysis.priority)}>
                            {item.aiAnalysis.priority} priority
                          </Badge>
                        )}
                        <Badge variant={item.processed ? 'default' : 'secondary'}>
                          {item.processed ? 'Processed' : 'Pending'}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-foreground mb-3">{item.content}</p>
                    
                    {item.category && (
                      <Badge variant="outline" className="mr-2">
                        {item.category}
                      </Badge>
                    )}
                    
                    {item.aiAnalysis && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.aiAnalysis.summary}</p>
                        {item.aiAnalysis.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.aiAnalysis.keywords.map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}