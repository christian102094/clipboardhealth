# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions

1. Agents can only be assigned to shifts from one Facility, therefore the Custom ID can be stored in the Agents table. Otherwise, each Facility could give different custom IDs to Agents.
2. At the moment, the new field will be optional/nullable so we do not force Facilities to fill it for all existing Agents, they will be able to do it on demand with the update functionality in the Staffing Platform.

### Ticket 1: Add Custom ID column to Agents table

- **Description:** Add a new column named "custom_id" to the Agents table in the database. This column should store a custom ID assigned to each agent only for reporting, so it doesn't need to be unique.
- **Time/effort estimates:** 1 story point
- **Implementation details:**
  - Repository: https://github.staffingcompany.com/staffing-database
  - Update the database model in the repository "staffing-database" to include the new column.
  - Read the README of the repository about how to generate migrations. It will be applied in DEV/QA/PROD by the CI pipeline when deployed.
  - The column will not have unique nor check constraints.
- **Acceptance Criteria:**
  - The new column should be named "custom_id" in the "Agents" table of the "Staffing" database
  - The column type should be VARCHAR(64) and NULLABLE

### Ticket 2: Add field Agent Custom ID in backend creation and edit endpoints

- **Description:** Add a new field named "Agent Custom ID" to the backend API for creating and editing Agents.
- **Time/effort estimates:** 3 story points
- **Implementation details:**
  - Repository: https://github.staffingcompany.com/staffing-api
  - Modify backend API creation endpoint to include the "Agent Custom ID" field.
  - Modify backend API edit endpoint to include the "Agent Custom ID" field.
  - In the request payload the name of the field should be "customId".
  - The "Agent Custom ID" will be optional. If it is empty or not provided, save it as NULL in the database.
  - If the field is provided, validate:
    - "Agent Custom ID" must be a string
    - "Agent Custom ID" must have a maximum length 50 characters
    - "Agent Custom ID" can't have special characters or whitespaces. Valid characters: "0-9", "a-z", "A-Z", "-", "\_"
  - Add unit tests and integration tests.
- **Acceptance Criteria:**
  - The field should be added to the API endpoints for creating Agents.
  - The field should be added to the API endpoints for updating Agents.
  - The new field should be named "customId" in the request payloads.
  - The field should be optional for both endpoints.
  - The field should be validated (type, length and valid characters)

### Ticket 3: Add field Agent Custom ID in frontend mobile app

- **Description:** Add a new field "Agent Custom ID" to the form used by Facilities to add new agents in the Staffing Platform UI.
- **Time/effort estimates:** 3 story points
- **Implementation details:**
  - Repository: https://github.staffingcompany.com/staffing-mobile-app
  - Modify the Agent creation form to include the new field before the field "First Name".
  - Modify the Agent edit form to include the new field before the field "First Name".
  - Modify the logic to send the field "customId" in the payload of the requests to the backend endpoints of the Staffing API.
  - If provided, validate the following:
    - It must have a maximum length 50 characters
    - It can't have special characters or whitespaces. Valid characters: "0-9", "a-z", "A-Z", "-", "\_"
  - If not provided, send to the backend as an empty string
  - Write unit tests
- **Acceptance Criteria:**
  - The field should be added to the forms used by Facilities to create and edit Agents.
  - The new field should be labeled "Agent Custom ID" or "Custom ID".
  - The new field should be positioned before the field "First Name.
  - The field should be an optional field.
  - The field should be validated (length and valid characters)

### Ticket 4: Add Agent Custom ID field to getShiftsByFacility metadata

- **Description:** Add the "Agent Custom ID" field to the metadata returned by the `getShiftsByFacility` function.
- **Time/effort estimates:** 3 story point
- **Implementation details:**
  - Repository: https://github.staffingcompany.com/staffing-reports
  - Modify the response of the `getShiftsByFacility` to include the agent customId in the metadata. For example:
    ```
    [
      {
        "shiftId": "123",
        "facilityId": "321",
        "metadata": {
          "agent": {
            "firstName": "Paul",
            "lastName": "Graham",
            "id": "00000001",
            "customId": "sectorA_agent1"
          }
        }
      }
    ]
    ```
  - This "customId" corresponds to the "customId" field of the "Agents" table in the "Staffing" database.
  - Modify the `generateReport` function:
    - Modify its input so it receives the "Agent Custom ID" as part of the list of shifts.
    - Modify the report template to include the "Agent Custom ID" before the field "First Name"
  - Write unit and integration tests.
- **Acceptance Criteria:**
  - The metadata returned by the `getShiftsByFacility` function should include the "customId" in the metadata of its result.
  - The value of the "Agent Custom ID" field should be the custom ID assigned to the agent.
  - The function `generateReport` now receives the "Agent Custom ID" field.
  - The report generated by the `generateReport` function should include the "Agent Custom ID" field.
