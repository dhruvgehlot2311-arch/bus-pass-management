# Program 3 Execution Output & Verification
### Node.js Server-Side Utility for Bus Pass Management (Without Express)
**Course Outcome:** CO4  
**Roll No:** 14 | **Subject:** Full Stack Development: Web Dev

---

## 1. How to See the Output

### Run the Automated Stream & Event Test Runner in Terminal
Run from your terminal:
```powershell
node program3/test_runner.js
```

### Or Start the Native HTTP Server
```powershell
node program3/server.js
```
The server will start at `http://localhost:3001` with routes:
- `GET http://localhost:3001/passes`
- `GET http://localhost:3001/passes/:id`
- `POST http://localhost:3001/passes`
- `DELETE http://localhost:3001/passes/:id`

---

## 2. Terminal Test Execution Output

```text
=================================================================
   PROGRAM 3: NODE.JS SERVER-SIDE UTILITY FOR BUS PASS MANAGEMENT
   Roll No: 14 | Course Outcome: CO4
   Features: File System, Path, Readable/Writable Streams, EventEmitter
=================================================================

[TEST 1] Reading initial passes using Streams (readAllPasses)...
Success: Retrieved 3 existing passes from passes.json.
┌─────────┬─────────────────┬────────────────┬──────────┬────────────────────────────────┬─────────────┐
│ (index) │ ID              │ Student        │ Roll     │ Route                          │ Type        │
├─────────┼─────────────────┼────────────────┼──────────┼────────────────────────────────┼─────────────┤
│ 0       │ '1700000000001' │ 'Aarav Sharma' │ 'CS2201' │ 'Route-A: Andheri to College'  │ 'Monthly'   │
│ 1       │ '1700000000002' │ 'Priya Mehta'  │ 'CS2202' │ 'Route-B: Borivali to College' │ 'Quarterly' │
│ 2       │ '1700000000003' │ 'Rahul Verma'  │ 'CS2203' │ 'Route-C: Thane to College'    │ 'Annual'    │
└─────────┴─────────────────┴────────────────┴──────────┴────────────────────────────────┴─────────────┘

[TEST 2] Appending a new bus pass using Writable Stream and EventEmitter...

[EVENT] pass:created
  ➤  ID         : 1794838910384
  ➤  Student    : Dhruv Roll14 (Roll: 14BEAIDS01)
  ➤  Route      : Route 14 - Gandhinagar Campus Express
  ➤  Bus No     : GJ-14-BD-9001
  ➤  Pass Type  : Quarterly
  ➤  Contact    : 9876543210
  ➤  Active     : true
  ➤  Created At : 2026-11-16T14:21:50.384Z
──────────────────────────────────────────────────
Pass created successfully via Stream with ID: 1794838910384

[TEST 3] Fetching pass by ID using getPassById()...
Pass found: {
  "id": "1794838910384",
  "studentName": "Dhruv Roll14",
  "rollNo": "14BEAIDS01",
  "route": "Route 14 - Gandhinagar Campus Express",
  "busNo": "GJ-14-BD-9001",
  "passType": "Quarterly",
  "contactNo": "9876543210",
  "isActive": true,
  "createdAt": "2026-11-16T14:21:50.384Z"
}

[TEST 4] Verifying all passes count after addition...
Current total passes: 4

[TEST 5] Deleting the added pass using deletePass()...

[EVENT] pass:deleted
  ➤  Deleted Pass ID : 1794838910384
  ➤  Timestamp       : 2026-11-16T14:21:50.393Z
──────────────────────────────────────────────────
Deletion result: Success (Pass deleted)

[TEST 6] Confirming deletion from passes.json...
Final passes count: 3

=================================================================
   PROGRAM 3 EXECUTION & VERIFICATION COMPLETED SUCCESSFULLY!
=================================================================
```

---

## 3. Architecture & Core Modules
1. **Readable Stream (`fs.createReadStream`)**: Reads data chunk by chunk from `passes.json`, buffers chunks, and parses JSON on stream `end`.
2. **Writable Stream (`fs.createWriteStream`)**: Writes stringified JSON data cleanly into `passes.json` when records are created or removed.
3. **EventEmitter (`eventBus.js`)**: Custom event bus emitting `pass:created` and `pass:deleted` events. Handlers log event details with timestamps.
4. **Native HTTP Dispatcher (`server.js`)**: Implements request handling and body parsing via raw HTTP streams without Express.
