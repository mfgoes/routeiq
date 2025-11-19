# RouteIQ API Examples

Complete examples for testing all API endpoints.

## Authentication

### 1. Register a new user

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "runner@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Runner"
  }'
```

Response:
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid-here",
    "email": "runner@example.com",
    "firstName": "John",
    "lastName": "Runner",
    "subscriptionTier": "free",
    "createdAt": "2025-11-19T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "runner@example.com",
    "password": "password123"
  }'
```

**Save the token from the response!** Use it in subsequent requests:
```bash
export TOKEN="your-token-here"
```

### 3. Get current user profile

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update profile

```bash
curl -X PUT http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny",
    "dateOfBirth": "1990-01-15",
    "gender": "male"
  }'
```

---

## Routes

### 1. Create a route

```bash
curl -X POST http://localhost:3001/api/routes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Loop Around Park",
    "description": "Easy 5K loop with good views",
    "distance": 5000,
    "elevationGain": 45,
    "elevationLoss": 45,
    "routeGeometry": {
      "type": "LineString",
      "coordinates": [
        [4.3007, 52.0705],
        [4.3010, 52.0708],
        [4.3015, 52.0710],
        [4.3020, 52.0708],
        [4.3007, 52.0705]
      ]
    },
    "routeType": "loop",
    "surfaceTypes": ["road", "path"],
    "difficultyRating": "easy",
    "estimatedTime": 1800,
    "isPublic": false,
    "isFavorite": true
  }'
```

Response:
```json
{
  "message": "Route created successfully",
  "route": {
    "id": "route-uuid",
    "name": "Morning Loop Around Park",
    "distance": 5000,
    "elevationGain": 45,
    ...
  }
}
```

### 2. List your routes

```bash
# All routes
curl http://localhost:3001/api/routes \
  -H "Authorization: Bearer $TOKEN"

# Only favorites
curl "http://localhost:3001/api/routes?favorite=true" \
  -H "Authorization: Bearer $TOKEN"

# Sort by distance
curl "http://localhost:3001/api/routes?sort=distance&order=asc" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get route details

```bash
curl http://localhost:3001/api/routes/{route-id} \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update route

```bash
curl -X PUT http://localhost:3001/api/routes/{route-id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Route Name",
    "isFavorite": true,
    "isPublic": true
  }'
```

### 5. Delete route

```bash
curl -X DELETE http://localhost:3001/api/routes/{route-id} \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Browse public routes

```bash
# No authentication needed
curl http://localhost:3001/api/routes/public

# Filter by difficulty
curl "http://localhost:3001/api/routes/public?difficulty=moderate"

# Filter by distance (±10%)
curl "http://localhost:3001/api/routes/public?distance=5000"

# Pagination
curl "http://localhost:3001/api/routes/public?limit=10&offset=0"
```

---

## Activities

### 1. Log a run (manual entry)

```bash
curl -X POST http://localhost:3001/api/activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Easy Run",
    "activityType": "run",
    "startedAt": "2025-11-19T07:00:00Z",
    "distance": 5000,
    "duration": 1620,
    "movingTime": 1620,
    "elevationGain": 45,
    "averagePace": 5.4,
    "averageSpeed": 11.11,
    "maxSpeed": 14.5,
    "averageHeartRate": 145,
    "maxHeartRate": 165,
    "calories": 340,
    "temperature": 15,
    "weatherConditions": "cloudy",
    "perceivedEffort": 6,
    "notes": "Felt good, nice easy pace",
    "isRace": false
  }'
```

### 2. Log a run with route

```bash
# Use routeId from created route
curl -X POST http://localhost:3001/api/activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Park Loop",
    "routeId": "your-route-id-here",
    "activityType": "run",
    "startedAt": "2025-11-19T07:00:00Z",
    "distance": 5000,
    "duration": 1620,
    "averagePace": 5.4,
    "perceivedEffort": 7
  }'
```

### 3. List activities

```bash
# All activities
curl http://localhost:3001/api/activities \
  -H "Authorization: Bearer $TOKEN"

# Filter by type
curl "http://localhost:3001/api/activities?type=race" \
  -H "Authorization: Bearer $TOKEN"

# Filter by date range
curl "http://localhost:3001/api/activities?startDate=2025-11-01&endDate=2025-11-30" \
  -H "Authorization: Bearer $TOKEN"

# Pagination
curl "http://localhost:3001/api/activities?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get activity details

```bash
curl http://localhost:3001/api/activities/{activity-id} \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update activity

```bash
curl -X PUT http://localhost:3001/api/activities/{activity-id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Run Name",
    "perceivedEffort": 8,
    "notes": "Actually felt harder than expected",
    "isRace": true
  }'
```

### 6. Delete activity

```bash
curl -X DELETE http://localhost:3001/api/activities/{activity-id} \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get statistics

```bash
# All time stats
curl http://localhost:3001/api/activities/stats \
  -H "Authorization: Bearer $TOKEN"

# Last week
curl "http://localhost:3001/api/activities/stats?period=week" \
  -H "Authorization: Bearer $TOKEN"

# Last month
curl "http://localhost:3001/api/activities/stats?period=month" \
  -H "Authorization: Bearer $TOKEN"

# Last year
curl "http://localhost:3001/api/activities/stats?period=year" \
  -H "Authorization: Bearer $TOKEN"

# Custom date range
curl "http://localhost:3001/api/activities/stats?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "period": "week",
  "stats": {
    "totalRuns": 5,
    "totalDistance": 25000,
    "totalDuration": 8100,
    "totalElevationGain": 225,
    "totalCalories": 1700,
    "averagePace": 5.4,
    "averageDistance": 5000
  },
  "weeklyBreakdown": [
    {
      "week": "Week 1",
      "totalRuns": 2,
      "totalDistance": 10000,
      "totalDuration": 3240
    },
    ...
  ]
}
```

---

## Testing Flow

### Complete test flow for a new user:

```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","firstName":"Test"}'

# 2. Save the token
export TOKEN="paste-token-here"

# 3. Create a route
ROUTE_RESPONSE=$(curl -X POST http://localhost:3001/api/routes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Route",
    "distance": 5000,
    "routeGeometry": {
      "type": "LineString",
      "coordinates": [[4.3, 52.0], [4.31, 52.01]]
    }
  }')

# Extract route ID (requires jq)
ROUTE_ID=$(echo $ROUTE_RESPONSE | jq -r '.route.id')

# 4. Log a run on that route
curl -X POST http://localhost:3001/api/activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"routeId\": \"$ROUTE_ID\",
    \"startedAt\": \"2025-11-19T07:00:00Z\",
    \"distance\": 5000,
    \"duration\": 1800,
    \"averagePace\": 6.0
  }"

# 5. Check stats
curl http://localhost:3001/api/activities/stats \
  -H "Authorization: Bearer $TOKEN"

# 6. List routes
curl http://localhost:3001/api/routes \
  -H "Authorization: Bearer $TOKEN"

# 7. List activities
curl http://localhost:3001/api/activities \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

When rate limited:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```
