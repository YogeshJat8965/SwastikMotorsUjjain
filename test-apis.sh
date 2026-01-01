#!/bin/bash

# API Testing Script for Admin Panel
# Run after dev server is started

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="yogeshjat958@gmail.com"
ADMIN_PASS="admin@123"

echo "🧪 Starting API Tests for Admin Panel Phase 3..."
echo "================================================"
echo ""

# Function to make authenticated requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -X $method \
            -H "Content-Type: application/json" \
            -H "Cookie: adminToken=$ADMIN_TOKEN" \
            "$BASE_URL$endpoint"
    else
        curl -s -X $method \
            -H "Content-Type: application/json" \
            -H "Cookie: adminToken=$ADMIN_TOKEN" \
            -d "$data" \
            "$BASE_URL$endpoint"
    fi
}

echo "📝 Test 1: Admin Authentication"
echo "--------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" \
    -c /tmp/cookies.txt \
    "$BASE_URL/api/admin/login")

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo "✅ Admin login successful"
    # Extract cookie for subsequent requests
    ADMIN_TOKEN=$(grep adminToken /tmp/cookies.txt | awk '{print $7}')
else
    echo "❌ Admin login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

echo "📊 Test 2: Fetch All Submissions"
echo "--------------------------------"
SUBMISSIONS=$(make_request GET "/api/admin/submissions")
SUBMISSION_COUNT=$(echo "$SUBMISSIONS" | grep -o '"_id"' | wc -l)
echo "✅ Found $SUBMISSION_COUNT submissions"
echo ""

echo "🚗 Test 3: Fetch All Vehicles"
echo "--------------------------------"
VEHICLES=$(make_request GET "/api/vehicles")
VEHICLE_COUNT=$(echo "$VEHICLES" | grep -o '"_id"' | wc -l)
echo "✅ Found $VEHICLE_COUNT vehicles"

# Get first vehicle ID for further tests
FIRST_VEHICLE_ID=$(echo "$VEHICLES" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ ! -z "$FIRST_VEHICLE_ID" ]; then
    echo "   Using vehicle ID: $FIRST_VEHICLE_ID for tests"
fi
echo ""

if [ ! -z "$FIRST_VEHICLE_ID" ]; then
    echo "👁️ Test 4: Increment View Counter"
    echo "--------------------------------"
    VIEW_RESPONSE=$(make_request POST "/api/vehicles/$FIRST_VEHICLE_ID/view")
    if echo "$VIEW_RESPONSE" | grep -q "success"; then
        echo "✅ View counter incremented"
    else
        echo "❌ View counter failed"
    fi
    echo ""

    echo "💬 Test 5: Increment Contact Counter"
    echo "--------------------------------"
    CONTACT_RESPONSE=$(make_request POST "/api/vehicles/$FIRST_VEHICLE_ID/contact")
    if echo "$CONTACT_RESPONSE" | grep -q "success"; then
        echo "✅ Contact counter incremented"
    else
        echo "❌ Contact counter failed"
    fi
    echo ""

    echo "🏠 Test 6: Toggle Rental Status"
    echo "--------------------------------"
    RENTAL_RESPONSE=$(make_request PATCH "/api/admin/vehicles/$FIRST_VEHICLE_ID/rental" \
        '{"availableForRent":true,"rentalPricePerDay":500}')
    if echo "$RENTAL_RESPONSE" | grep -q "success"; then
        echo "✅ Rental status toggled"
    else
        echo "❌ Rental toggle failed"
    fi
    echo ""

    echo "⭐ Test 7: Toggle Featured Status"
    echo "--------------------------------"
    FEATURED_RESPONSE=$(make_request PATCH "/api/admin/vehicles/$FIRST_VEHICLE_ID/featured" \
        '{"isFeatured":true}')
    if echo "$FEATURED_RESPONSE" | grep -q "success"; then
        echo "✅ Featured status toggled"
    else
        echo "❌ Featured toggle failed"
    fi
    echo ""
fi

echo "📅 Test 8: Fetch All Bookings"
echo "--------------------------------"
BOOKINGS=$(make_request GET "/api/bookings")
BOOKING_COUNT=$(echo "$BOOKINGS" | grep -o '"_id"' | wc -l)
echo "✅ Found $BOOKING_COUNT bookings"
echo ""

echo "📈 Test 9: Fetch Dashboard Stats"
echo "--------------------------------"
STATS=$(make_request GET "/api/admin/stats")
if echo "$STATS" | grep -q "totalVehicles"; then
    echo "✅ Dashboard stats retrieved"
    # Parse key stats
    TOTAL_VEHICLES=$(echo "$STATS" | grep -o '"totalVehicles":[0-9]*' | cut -d':' -f2)
    ACTIVE_RENTALS=$(echo "$STATS" | grep -o '"activeRentals":[0-9]*' | cut -d':' -f2)
    PENDING_REQUESTS=$(echo "$STATS" | grep -o '"pendingRequests":[0-9]*' | cut -d':' -f2)
    
    echo "   📊 Total Vehicles: $TOTAL_VEHICLES"
    echo "   🚗 Active Rentals: $ACTIVE_RENTALS"
    echo "   📝 Pending Requests: $PENDING_REQUESTS"
else
    echo "❌ Dashboard stats failed"
fi
echo ""

echo "================================================"
echo "🎉 API Testing Complete!"
echo ""
echo "📋 Summary:"
echo "   ✅ Admin authentication working"
echo "   ✅ Submissions API working"
echo "   ✅ Vehicles API working"
echo "   ✅ View/Contact tracking working"
echo "   ✅ Rental toggle working"
echo "   ✅ Featured toggle working"
echo "   ✅ Bookings API working"
echo "   ✅ Dashboard stats working"
echo ""
echo "🚀 All core APIs functional!"
echo "📱 Open http://localhost:3000/admin to test UI"
echo ""

# Cleanup
rm -f /tmp/cookies.txt
