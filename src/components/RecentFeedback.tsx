'use client';

import { useUserFeedback } from '@/hooks/useFeedback';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RecentFeedback() {
  const { currentUser } = useAuth();
  console.log('currentUser', currentUser);
  const { feedback, loading, error, refetch } = useUserFeedback({ 
    userId: currentUser?.uid || '' 
  });

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

  const formatDate = (date: Date | string | number) => {
    try {
      // Convert to Date object if it's not already
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error, 'Original date:', date);
      return 'Invalid date';
    }
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-destructive">Error loading feedback: {error}</p>
            <button
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to view your feedback</p>
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
