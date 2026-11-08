# Next.js / React admin templates

Reference components, not a deployed application: `AdminSidebar`, `UsersPage`, `RoleMatrix`, `SurveyBuilder`, `ReportsPanel`, `NotificationComposer`, and `CmsEditor`. Each receives **permission-filtered data and authorized callbacks** from the consuming backend. React 18+ and Tailwind-style utility classes are expected; replace classes with your own design system if needed.

The backend must enforce authorization, maker-checker approval, tenant and geography filters, pagination, concurrency, safe report queries and notification consent. Frontend permissions only affect navigation and button visibility. `UsersPage` uses a simple confirmation prompt; replace it with a styled dialog in a production UX. `SurveyBuilder` is a useful base, but requires target selection, version history and photo media services before complete field reporting.
