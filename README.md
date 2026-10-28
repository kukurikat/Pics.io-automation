Pics.io - Saved Searches Test Plan and Automation Suite

This repository contains the test documentation and an automated end-to-end test suite implemented with Playwright and TypeScript for the Team Saved Searches feature of the Pics.io Digital Asset Management platform.

1. Project Overview

Target Feature: Team Saved Searches (sidebar management, filtering, state persistence, and lifecycle operations).

Core Stack: Playwright, TypeScript, Node.js.

Design Pattern: Page Object Model (POM) separating page element locators and high-level interaction methods from test assertions.

Authentication Strategy: Centralized setup project leveraging Playwright's storageState to persist the authenticated session to an authorization file (auth/user.json). Subsequent test executions reuse this session, eliminating redundant login operations and minimizing authentication-related flakiness.

2. Test Plan Summary

The quality assurance strategy for the Saved Searches functionality encompasses both functional verification and critical edge cases:

Entity Lifecycle (CRUD): Verification of creation, renaming, parameter updates, and deletion of saved search items across individual and team workspaces.

Filter State and Catalog Synchronization: Ensuring applied search criteria reflect accurately in active filter chips, catalog empty states, and catalog item counts, with proper reversion upon filter resetting.

Sidebar Search and Tree Navigation: Real-time filtering and visibility management within the Saved Searches tree container.

Micro-interactions and Feedback: Toast notifications (HUD), undo actions, and favoriting behavior.

Data Integrity and Resilience: Validating boundary constraints, long strings, and input sanitization against script injections.

3. Automated Test Suite Scope

The automated test suite (tests/saved-searches.spec.ts) implements five core end-to-end scenarios covering critical user journeys:

Create Saved Search:

Saves current search criteria under a dynamically generated unique identifier.

Asserts that the new entity appears and is rendered within the Team Saved Searches navigation panel.

Delete Saved Search:

Creates a temporary saved search entity as a prerequisite.

Triggers the row deletion action and confirms its complete removal from the DOM tree.

Apply Existing Saved Search:

Navigates through the folder structure (e.g., Restricted directory) and selects a predefined search (Corrupted files).

Verifies that corresponding filter indicators (such as the = 0KB filter chip) and relevant explanatory states are displayed.

Reset Filters to Default State:

Records the baseline count of asset cards within the #tiles catalog container.

Applies an active filter criteria set.

Invokes the Reset filters action and asserts that active filter indicators are cleared and the asset card count returns to its original baseline.

Sidebar Search Filtering:

Inputs search queries into the dedicated Search in saved searches sidebar field.

Asserts that matching saved searches remain visible while non-matching items are properly excluded from view.

4. Prerequisites and Installation

Prerequisites

Node.js version 18.x or higher.

npm package manager.

Installation Steps

Clone the repository and navigate to the project directory:

git clone <repository-url>
cd picsio-playwright-tests

Install project dependencies:

npm install

Install the required Playwright browser binaries:

npx playwright install chromium

Configure environment variables by creating a .env file in the root directory:

BASE_URL=https://pics.io
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password

5. Test Execution

Step 1: Authentication State Generation

Run the setup project once to complete the login procedure, accept necessary consent banners, and output the session state to auth/user.json:

npx playwright test --project=setup

Step 2: Executing Functional Tests

Once the authentication session is established, run the primary test suite:

Headless mode (standard):

npx playwright test tests/saved-searches.spec.ts

Headed mode (interactive browser window):

npx playwright test tests/saved-searches.spec.ts --headed

Generate and inspect the HTML execution report:

npx playwright show-report

6. Directory Structure

├── auth/ # Persisted authentication state (user.json)
├── src/
│ ├── components/ # Reusable UI component representations (FilterBar.ts)
│ └── pages/ # Page Object models (BasePage.ts, SavedSearchesPage.ts)
├── tests/
│ ├── auth.setup.ts # Authentication setup routine and session caching
│ └── saved-searches.spec.ts # Core automated test scenarios
├── .env.example # Template for required environment variables
├── playwright.config.ts # Global Playwright configuration
└── README.md # Project documentation and test plan
