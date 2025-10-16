# Mobile Event Detail Integration Guide

This document explains how to integrate event detail fetching in your mobile app.

## API Endpoint

```
GET /api/events/{eventId}
```

### Response Format

```typescript
interface EventDetailsResponse {
  event: {
    id: string;
    title: string;
    description?: string;
    startDateTime: string;  // ISO date string
    endDateTime?: string;   // ISO date string
    venue?: string;
    category?: string;
    maxParticipants?: number;
    registeredCount: number; // Current number of registrations
    club: {
      id: string;
      name: string;
      profileImage?: string;
    };
  }
}
```

## Example Usage (React Native)

### 1. Create Event Detail Types

```typescript
// types/event.ts
export interface EventDetails {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;  
  endDateTime?: string;
  venue?: string;
  category?: string;
  maxParticipants?: number;
  registeredCount: number;
  club: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface EventDetailsResponse {
  event: EventDetails;
}
```

### 2. Create an API Service

```typescript
// services/eventService.ts
import { API_BASE_URL } from '@/config';
import { EventDetailsResponse } from '@/types/event';

export const fetchEventDetails = async (eventId: string): Promise<EventDetailsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};
```

### 3. Create Event Detail Screen

```typescript
// screens/EventDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchEventDetails } from '@/services/eventService';
import { EventDetails } from '@/types/event';
import { formatDate } from '@/utils/dateUtils';

type EventDetailRouteProp = RouteProp<{ params: { eventId: string } }, 'params'>;

const EventDetailScreen: React.FC = () => {
  const route = useRoute<EventDetailRouteProp>();
  const { eventId } = route.params;
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchEventDetails(eventId);
        setEvent(response.event);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || "Couldn't load event details"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Event Image */}
      <Image 
        source={{ 
          uri: `https://images.unsplash.com/photo-${1529156069898 + parseInt(event.id)}?w=800&h=400&fit=crop`,
          // You can replace this with actual event image when available
        }} 
        style={styles.eventImage}
      />
      
      {/* Event Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.tagsContainer}>
          {event.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.tagText}>{event.category}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date & Time:</Text>
          <Text style={styles.detailValue}>
            {formatDate(event.startDateTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Venue:</Text>
          <Text style={styles.detailValue}>{event.venue || 'TBD'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Organized by:</Text>
          <Text style={styles.detailValue}>{event.club.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Participants:</Text>
          <Text style={styles.detailValue}>{event.registeredCount} / {event.maxParticipants || 'Unlimited'}</Text>
        </View>
      </View>

      {/* Event Description */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.description}>{event.description || 'No description provided.'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#FFF0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FF8C00',
    fontWeight: '600',
    fontSize: 12,
  },
  detailsContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 120,
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  sectionContainer: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
});

export default EventDetailScreen;
```

### 4. Utils for Date Formatting

```typescript
// utils/dateUtils.ts
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

## Navigation Integration

```typescript
// navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import EventsScreen from '@/screens/EventsScreen';
import EventDetailScreen from '@/screens/EventDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen}
        options={({ route }) => ({ 
          title: 'Event Details'
        })}
      />
    </Stack.Navigator>
  );
};
```

## Navigating to Event Details

```typescript
// In your events list component
import { useNavigation } from '@react-navigation/native';

const EventsListItem = ({ event }) => {
  const navigation = useNavigation();
  
  const goToEventDetails = () => {
    navigation.navigate('EventDetail', { eventId: event.id });
  };
  
  return (
    <TouchableOpacity onPress={goToEventDetails}>
      {/* Event item UI */}
    </TouchableOpacity>
  );
};
```

## Error Handling

Implement proper error handling in your app to handle cases where the API might be unavailable or return errors:

1. Network errors
2. Invalid event IDs
3. Server errors

## Caching Considerations

For better performance, consider implementing caching for event details:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache event details
const cacheEventDetails = async (eventId: string, data: EventDetails) => {
  try {
    await AsyncStorage.setItem(`event_${eventId}`, JSON.stringify(data));
    await AsyncStorage.setItem(`event_${eventId}_timestamp`, Date.now().toString());
  } catch (error) {
    console.error('Error caching event details:', error);
  }
};

// Get cached event details (with TTL of 5 minutes)
const getCachedEventDetails = async (eventId: string): Promise<EventDetails | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(`event_${eventId}`);
    const timestamp = await AsyncStorage.getItem(`event_${eventId}_timestamp`);
    
    if (cachedData && timestamp) {
      const ttl = 5 * 60 * 1000; // 5 minutes in milliseconds
      const now = Date.now();
      
      if (now - parseInt(timestamp) < ttl) {
        return JSON.parse(cachedData);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached event details:', error);
    return null;
  }
};
```

## Testing

Be sure to test your event detail integration with various test cases:

1. Valid event IDs
2. Invalid event IDs
3. Network offline scenarios
4. Partial data (some fields missing)
5. Different event types/categories
