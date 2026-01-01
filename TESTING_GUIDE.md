# Testing Guide - Admin Panel Phase 3

## 🎯 Testing Overview
This guide covers complete testing of all Phase 3 admin features.

## 📋 Prerequisites
- Dev server running: `npm run dev`
- Admin credentials: yogeshjat958@gmail.com / admin@123
- MongoDB connection active

---

## 1. ✅ Purchase Workflow Testing

### Test Scenario: Convert Submission to Vehicle
**Steps:**
1. Navigate to **Admin → Requests Management**
2. Find an 'approved' submission
3. Click **"I Want to Buy"** button (blue button with shopping cart icon)
4. Verify you're redirected to `/admin/requests/[id]`
5. On detail page, verify:
   - All submission details displayed correctly
   - Image gallery with lightbox (click image to expand)
   - Owner contact info with WhatsApp/Call buttons
   - Expected price highlighted in green

6. Click **"Purchase This Vehicle"** button
7. In purchase form modal, verify:
   - Purchase price pre-filled with expected price
   - Selling price auto-suggests 20% profit when you enter purchase price
   - Profit calculator shows amount and percentage
   - Red warning if selling ≤ purchase (negative profit)
   - Rental availability checkbox + daily rate input
   - Additional notes textarea

8. Test price negotiation:
   - Enter purchase price: ₹80,000 (if expected was ₹100,000)
   - Observe selling price auto-updates to ₹96,000 (20% profit)
   - Profit shows: ₹16,000 (20%)
   - Try selling < purchase: ₹75,000 → Profit shows negative in red

9. Fill form:
   - Purchase Price: ₹80,000
   - Selling Price: ₹95,000
   - Available for Rent: ✓
   - Daily Rate: ₹1,500
   - Notes: "Good condition, minor scratches"

10. Click **"Complete Purchase"**
11. Verify success:
    - Alert: "Vehicle purchased successfully"
    - Redirected to `/admin/inventory/edit/[vehicleId]`
    - All data pre-filled from submission
    - Can edit details further

12. Navigate to **Requests Management**
13. Verify submission now shows:
    - Status badge: **Purchased** (purple color)
    - 'purchased' filter tab shows this submission
    - Can no longer purchase again

14. Navigate to **Inventory Management**
15. Verify new vehicle appears:
    - All submission data copied correctly
    - Purchase/Selling prices match entered values
    - Rental availability ON
    - Status: for_sale

**Expected Results:**
✅ Submission → Vehicle conversion successful
✅ All data copied (images, specs, location, owner info)
✅ Profit calculator accurate
✅ Rental options applied
✅ sourceSubmissionId reference saved
✅ Submission status updated to 'purchased'

---

## 2. ✅ View/Contact Tracking Testing

### Test Scenario: Track Customer Engagement
**Steps:**
1. Navigate to **Admin → Inventory**
2. Find any vehicle
3. Note current view count and contact count (displayed as: 👁️ 45 💬 12)
4. Click **"Preview"** button (opens `/vehicle/[id]` in new tab)
5. On public vehicle page, click **"Contact via WhatsApp"** button
6. Close tab and return to admin inventory
7. Refresh inventory page
8. Verify counters updated:
   - Views: +1 (if implemented)
   - Contacts: +1

**Expected Results:**
✅ View counter increments when public page viewed
✅ Contact counter increments when WhatsApp clicked
✅ Counters display correctly in inventory (icon + number)

---

## 3. ✅ Inventory Enhancements Testing

### Test Scenario: New Inventory Actions
**Steps:**
1. Navigate to **Admin → Inventory**
2. Select any vehicle card
3. Verify action buttons layout (3 rows):
   - **Row 1:** Edit | Preview | Delete
   - **Row 2:** Toggle Rental | Toggle Featured
   - **Row 3:** Mark as Sold (full width, only if for_sale)

4. Test **Preview** button:
   - Click Preview (external link icon)
   - Opens `/vehicle/[id]` in new tab
   - Shows public view of vehicle
   - Close tab

5. Test **Toggle Rental** button:
   - Click button
   - If currently OFF (gray): turns ON (purple bg)
   - If currently ON (purple): turns OFF (gray bg)
   - Alert: "Rental status updated"
   - Vehicle now appears/disappears in booking form dropdown
   - Icon: Home 🏠

6. Test **Toggle Featured** button:
   - Click button
   - If currently OFF (gray): turns ON (yellow bg ⭐)
   - If currently ON (yellow): turns OFF (gray bg)
   - Alert: "Featured status updated"
   - Featured vehicles show on homepage
   - Icon: Star ⭐

7. Verify stats display:
   - Views counter with eye icon: 👁️ 45
   - Contacts counter with message icon: 💬 12
   - Both displayed side by side

**Expected Results:**
✅ Preview opens public page in new tab
✅ Toggle Rental updates availableForRent boolean
✅ Toggle Featured updates isFeatured boolean
✅ Button colors indicate current state (purple=ON, gray=OFF)
✅ Alerts show on successful update
✅ Stats display both view and contact counts

---

## 4. ✅ Manual Booking Creation Testing

### Test Scenario: Create Rental Booking
**Steps:**
1. Navigate to **Admin → Rental Bookings**
2. Click **"Add Booking"** button (blue, top right with Plus icon)
3. Verify BookingForm modal opens
4. Test form fields:

   **Vehicle Selection:**
   - Dropdown shows only availableForRent=true vehicles
   - Format: "Brand Model Year - ₹DailyRate/day"
   - Select: "Honda Activa 2020 - ₹500/day"

   **Customer Information:**
   - Name: "Rahul Sharma"
   - Phone: "9876543210" (10 digits required)
   - Email: "rahul@example.com"

   **Rental Period:**
   - Start Date: Tomorrow (min=today)
   - End Date: 3 days later (min=start date)
   - Verify date pickers show calendars
   - Verify end date can't be before start date

   **Pickup Location:**
   - Enter: "Jaipur Railway Station"

5. Verify auto-calculations:
   - Total Days: Should calculate automatically (3 days)
   - Total Price: Should show (3 days × ₹500 = ₹1,500)
   - Booking summary card displays:
     - Daily Rate: ₹500
     - Total Days: 3
     - Total Price: ₹1,500 (highlighted in blue)

6. Click **"Create Booking"** button
7. Verify success:
   - Modal closes
   - Alert: "Booking created successfully"
   - Bookings list refreshes
   - New booking appears with status: Pending

8. Verify new booking displays:
   - Customer name: Rahul Sharma
   - Vehicle: Honda Activa 2020
   - Dates: Tomorrow - 3 days later
   - Total: ₹1,500
   - Status badge: Pending (orange)
   - Actions: WhatsApp, Call, Confirm, Cancel buttons

**Expected Results:**
✅ Form validation works (required fields, date logic)
✅ Auto-calculation accurate (days, price)
✅ Booking created with correct data
✅ customerWhatsapp auto-filled from phone
✅ Status defaults to 'pending'
✅ List refreshes with new booking

---

## 5. ✅ Date Conflict Prevention Testing

### Test Scenario: Prevent Overlapping Bookings
**Setup:** Create first booking:
- Vehicle: Honda Activa 2020
- Start: Jan 10, 2025
- End: Jan 15, 2025
- Status: Confirmed

**Test Cases:**

**Test 1: New booking starts during existing**
- Start: Jan 12, 2025 (during existing)
- End: Jan 18, 2025
- Expected: ❌ 409 Conflict error
- Message: "Vehicle already booked for these dates"
- Shows conflict details

**Test 2: New booking ends during existing**
- Start: Jan 8, 2025
- End: Jan 12, 2025 (during existing)
- Expected: ❌ 409 Conflict error

**Test 3: New booking contains existing**
- Start: Jan 9, 2025
- End: Jan 16, 2025 (contains Jan 10-15)
- Expected: ❌ 409 Conflict error

**Test 4: New booking before existing**
- Start: Jan 5, 2025
- End: Jan 9, 2025 (before Jan 10)
- Expected: ✅ Booking created successfully

**Test 5: New booking after existing**
- Start: Jan 16, 2025 (after Jan 15)
- End: Jan 20, 2025
- Expected: ✅ Booking created successfully

**Test 6: Existing booking cancelled**
- Update first booking status to 'cancelled'
- Try Test 1 again (Jan 12-18)
- Expected: ✅ Booking created (cancelled bookings ignored)

**MongoDB Query Logic:**
```javascript
const conflicts = await Booking.find({
  vehicle: vehicleId,
  status: { $in: ['pending', 'confirmed'] }, // Only active bookings
  $or: [
    { startDate: { $lte: newStart }, endDate: { $gte: newStart } },  // Case 1
    { startDate: { $lte: newEnd }, endDate: { $gte: newEnd } },      // Case 2
    { startDate: { $gte: newStart }, endDate: { $lte: newEnd } }      // Case 3
  ]
});
```

**Expected Results:**
✅ Detects all 3 overlap scenarios correctly
✅ Returns 409 status with conflict details
✅ Ignores cancelled/completed bookings
✅ Allows bookings before/after existing dates
✅ Database remains consistent (no double-bookings)

---

## 6. 🧪 Reports & Analytics Testing

### Test Scenario: Verify Revenue Tracking
**Steps:**
1. Create purchase transaction:
   - Purchase Price: ₹80,000
   - Selling Price: ₹95,000
   - Expected Profit: ₹15,000

2. Create rental booking:
   - Daily Rate: ₹500
   - Total Days: 3
   - Total Price: ₹1,500
   - Update status to 'completed'

3. Navigate to **Admin → Reports**
4. Verify stats:
   - **Total Revenue:** ₹95,000 (from vehicle sale) + ₹1,500 (rental) = ₹96,500
   - **Total Profit:** ₹15,000 (sale profit) + ₹1,500 (rental revenue) = ₹16,500
   - **Active Rentals:** Count of confirmed bookings
   - **Completed Rentals:** Count of completed bookings

5. Verify charts/graphs show:
   - Revenue trend over time
   - Profit breakdown (sales vs rentals)
   - Top performing vehicles
   - Booking status distribution

**Expected Results:**
✅ Revenue calculates correctly (sales + rentals)
✅ Profit tracks sale profit + rental revenue
✅ Stats update in real-time
✅ Charts display accurate data

---

## 7. 🔒 Edge Cases Testing

### Test Case 1: Undefined Data Handling
**Steps:**
1. Create vehicle without optional fields (color, owners, adminNotes)
2. Verify inventory displays gracefully (no "undefined" text)
3. Edit vehicle and add missing data
4. Verify updates save correctly

**Expected:** ✅ Optional chaining prevents crashes, shows "-" or empty state

### Test Case 2: Negative Profit Warning
**Steps:**
1. In purchase form, enter:
   - Purchase Price: ₹100,000
   - Selling Price: ₹95,000
2. Verify profit shows: **-₹5,000 (-5%)** in red color
3. Confirmation dialog warns: "You're selling at a loss. Continue?"

**Expected:** ✅ Red alert, confirmation required for negative profit

### Test Case 3: Invalid Phone Number
**Steps:**
1. In booking form, enter phone: "123" (less than 10 digits)
2. Try to submit
3. Verify HTML5 validation error: "Please match the format"

**Expected:** ✅ Pattern validation prevents invalid phone

### Test Case 4: End Date Before Start Date
**Steps:**
1. In booking form:
   - Start Date: Jan 15, 2025
   - End Date: Jan 10, 2025 (before start)
2. Try to submit
3. Verify error: "End date must be after start date"

**Expected:** ✅ Validation prevents invalid date range

### Test Case 5: Mobile Navbar Overlap
**Steps:**
1. Open site on mobile (or browser DevTools mobile view)
2. Scroll to bottom
3. Click bottom navigation icon
4. Verify admin content not hidden by bottom nav
5. Verify BottomNav z-index > page content

**Expected:** ✅ No overlap, proper z-index layering

### Test Case 6: Image Gallery Lightbox
**Steps:**
1. On submission detail page, click any thumbnail image
2. Verify lightbox opens with full-size image
3. Click outside image (on backdrop)
4. Verify lightbox closes

**Expected:** ✅ Smooth open/close, backdrop click closes

### Test Case 7: Empty States
**Steps:**
1. Navigate to Requests Management with no submissions
2. Verify shows: "No submissions found" with icon
3. Navigate to Inventory with no vehicles
4. Verify shows: "No vehicles found" with icon
5. Navigate to Bookings with no bookings
6. Verify shows: "No bookings available yet" with calendar icon

**Expected:** ✅ All empty states display friendly messages

---

## 8. 📱 Mobile Responsive Testing

### Test Checklist:
- [ ] Admin login page responsive
- [ ] Dashboard stats cards stack vertically
- [ ] Requests table scrolls horizontally
- [ ] Purchase form modal fits mobile screen
- [ ] Inventory cards stack in single column
- [ ] Action buttons don't overflow
- [ ] Booking form fields stack vertically
- [ ] Date pickers work on mobile
- [ ] Bottom navigation doesn't overlap content
- [ ] Image gallery works with touch gestures
- [ ] WhatsApp links open WhatsApp app (on mobile)
- [ ] Phone links trigger call action (on mobile)

**Devices to Test:**
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Samsung Galaxy S20 (360px)
- iPad (768px)
- Desktop (1920px)

---

## 9. 🚀 Performance Testing

### Metrics to Check:
- [ ] Initial page load < 3s
- [ ] API response time < 500ms
- [ ] Image loading with Cloudinary optimization
- [ ] Lazy loading for large vehicle lists
- [ ] Search/filter results instant (< 100ms)
- [ ] Form submissions < 1s
- [ ] No memory leaks (check DevTools)

---

## 10. ✅ Final Acceptance Criteria

### Must Pass Before User Testing:
- [x] Purchase Workflow: Submission → Vehicle conversion works
- [x] View/Contact Tracking: Counters increment correctly
- [x] Inventory Enhancements: Preview, Rental toggle, Featured toggle functional
- [x] Manual Booking Creation: Form validation, auto-calculations work
- [x] Date Conflict Prevention: All overlap scenarios detected
- [x] Reports: Revenue and profit calculations accurate
- [ ] Edge Cases: All error scenarios handled gracefully
- [ ] Mobile: Responsive on all screen sizes
- [ ] Performance: Fast load times, no crashes

### Known Issues:
- None currently

### Future Enhancements:
- Email notifications for bookings
- SMS alerts for customers
- Bulk vehicle import (CSV)
- Advanced analytics with charts
- Customer management system
- Payment gateway integration

---

## 📞 Support
For issues or questions:
- Developer: [Your Name]
- Email: [Your Email]
- Project: Swastik Bike - Admin Panel Phase 3

---

**Last Updated:** January 2025
**Version:** 3.0.0
**Status:** ✅ All implementation complete, testing in progress
