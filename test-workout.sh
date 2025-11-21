#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MWE4ZTNhNi1hYjU2LTRmOTEtYTYwNS1kODgyMGE1YzZkMDMiLCJpYXQiOjE3NjM3NTk4NjksImV4cCI6MTc2NDM2NDY2OX0.MsBv_lpJwlit1zZdN30ZI808rb9UC4UT5hlxOEHQG8g"

echo "=== Testing Workout API Endpoints ==="
echo ""

echo "1. GET /api/workouts/exercises (first 3 exercises)"
curl -s -X GET "http://localhost:3001/api/workouts/exercises" \
  -H "Authorization: Bearer $TOKEN" | jq '.exercises[:3] | .[] | {id, name, category}'

echo ""
echo "2. POST /api/workouts (create workout)"
WORKOUT=$(curl -s -X POST "http://localhost:3001/api/workouts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Leg Day Test",
    "workoutType": "strength",
    "startedAt": "2025-11-21T20:00:00Z",
    "completedAt": "2025-11-21T21:00:00Z",
    "perceivedEffort": 8,
    "energyLevel": 7,
    "location": "Gym",
    "exercises": [
      {
        "exerciseId": "7106a540-aa43-486c-87bd-1db00ddea763",
        "exerciseOrder": 1,
        "sets": [
          {"set": 1, "reps": 10, "weight": 100, "restSeconds": 90, "rpe": 7},
          {"set": 2, "reps": 10, "weight": 100, "restSeconds": 90, "rpe": 8},
          {"set": 3, "reps": 8, "weight": 100, "restSeconds": 0, "rpe": 9}
        ]
      }
    ]
  }')

echo "$WORKOUT" | jq '{message, workout: {id, name, totalVolume, totalReps}}'
WORKOUT_ID=$(echo "$WORKOUT" | jq -r '.workout.id')

echo ""
echo "3. GET /api/workouts (list workouts)"
curl -s -X GET "http://localhost:3001/api/workouts" \
  -H "Authorization: Bearer $TOKEN" | jq '{total, workouts: .workouts | .[] | {id, name, totalVolume}}'

echo ""
echo "4. GET /api/workouts/:id (get single workout)"
curl -s -X GET "http://localhost:3001/api/workouts/$WORKOUT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.workout | {id, name, totalVolume, exercises: .exercises | length}'

echo ""
echo "5. PUT /api/workouts/:id (update workout)"
curl -s -X PUT "http://localhost:3001/api/workouts/$WORKOUT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Leg Day",
    "perceivedEffort": 9
  }' | jq '{message, workout: {id, name, perceivedEffort}}'

echo ""
echo "6. DELETE /api/workouts/:id (delete workout)"
curl -s -X DELETE "http://localhost:3001/api/workouts/$WORKOUT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "=== All tests completed! ==="
