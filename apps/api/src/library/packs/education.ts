import type { TemplatePack } from "../types";

// Course-platform pack. Friendly blue bar, generous radius and an orange
// accent for deadlines — approachable without looking like a toy.
export const educationPack: TemplatePack = {
  id: "education",
  name: "Education Pack",
  tagline: "Enrol, teach, certify",
  description:
    "Everything a course platform or school sends a learner — enrolment, lesson reminders, deadlines, grades and certificates.",
  audience: "EdTech, schools & course creators",
  theme: {
    brand: "#2563EB",
    onBrand: "#FFFFFF",
    accent: "#EA580C",
    bg: "#F1F5F9",
    card: "#FFFFFF",
    soft: "#F5F8FD",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
    fontFamily: "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif",
    radius: 16,
    buttonRadius: 10,
    headerStyle: "bar",
  },
  footer: {
    lines: [
      "{{company_name}} · {{company_address}}",
      "You're receiving this as a learner on {{company_name}}.",
    ],
    links: [
      { label: "My courses", href: "{{dashboard_url}}" },
      { label: "Help centre", href: "{{help_url}}" },
      { label: "Email preferences", href: "{{preferences_url}}" },
    ],
  },
  templates: [
    {
      key: "welcome-learner",
      name: "Learner Welcome",
      description: "First email after a learner account is created.",
      category: "onboarding",
      subject: "Welcome to {{company_name}}, {{first_name}}",
      preheader: "Your learning dashboard is ready.",
      blocks: [
        { type: "heading", text: "Welcome, {{first_name}} 🎓" },
        {
          type: "text",
          text: "Your {{company_name}} account is set up. Everything you enrol in lives in one dashboard, on any device.",
        },
        {
          type: "steps",
          items: [
            { title: "Finish your profile", text: "So instructors know who they're teaching." },
            { title: "Browse the catalogue", text: "{{course_count}} courses across {{category_count}} subjects." },
            { title: "Set a study goal", text: "Even 15 minutes a day builds a streak." },
          ],
        },
        { type: "button", label: "Go to my dashboard", href: "{{dashboard_url}}" },
      ],
    },
    {
      key: "course-enrollment",
      name: "Course Enrollment",
      description: "Confirms enrolment with start date and structure.",
      category: "transactional",
      subject: "You're enrolled in {{course_name}}",
      preheader: "Starts {{start_date}} · {{lesson_count}} lessons.",
      blocks: [
        { type: "heading", text: "You're enrolled in {{course_name}}" },
        { type: "text", text: "Taught by {{instructor_name}}. Here's what you signed up for:" },
        {
          type: "panel",
          rows: [
            { label: "Course", value: "{{course_name}}" },
            { label: "Instructor", value: "{{instructor_name}}" },
            { label: "Starts", value: "{{start_date}}" },
            { label: "Lessons", value: "{{lesson_count}} · {{total_duration}}" },
          ],
        },
        { type: "button", label: "Start lesson one", href: "{{course_url}}" },
        {
          type: "text",
          text: "Lessons unlock as you go, and your progress saves automatically.",
          muted: true,
        },
      ],
    },
    {
      key: "lesson-reminder",
      name: "Lesson Reminder",
      description: "Nudge back into a course after a gap.",
      category: "lifecycle",
      subject: "Pick up where you left off in {{course_name}}",
      preheader: "You're {{progress_percent}} of the way through.",
      blocks: [
        { type: "heading", text: "Ready for lesson {{lesson_number}}?" },
        {
          type: "text",
          text: "You're <strong>{{progress_percent}}</strong> through {{course_name}} — next up is <strong>{{lesson_name}}</strong> ({{lesson_duration}}).",
        },
        {
          type: "metrics",
          items: [
            { label: "Lessons done", value: "{{lessons_completed}}" },
            { label: "Streak", value: "{{streak_days}} days" },
            { label: "Time invested", value: "{{time_spent}}" },
          ],
        },
        { type: "button", label: "Resume the course", href: "{{resume_url}}" },
      ],
    },
    {
      key: "assignment-due",
      name: "Assignment Due",
      description: "Deadline warning with the submission link.",
      category: "operational",
      subject: "{{assignment_name}} is due {{due_date}}",
      preheader: "{{time_remaining}} left to submit.",
      blocks: [
        { type: "heading", text: "{{assignment_name}} is due soon" },
        {
          type: "callout",
          tone: "warning",
          text: "Due <strong>{{due_date}} at {{due_time}}</strong> — that's {{time_remaining}} from now.",
        },
        {
          type: "panel",
          rows: [
            { label: "Course", value: "{{course_name}}" },
            { label: "Assignment", value: "{{assignment_name}}" },
            { label: "Weight", value: "{{weight}} of final grade" },
            { label: "Late policy", value: "{{late_policy}}" },
          ],
        },
        { type: "button", label: "Submit your work", href: "{{submission_url}}" },
      ],
    },
    {
      key: "grade-posted",
      name: "Grade Posted",
      description: "Result notification with instructor feedback.",
      category: "transactional",
      subject: "Your grade for {{assignment_name}}",
      preheader: "{{grade}} — feedback from {{instructor_name}} inside.",
      blocks: [
        { type: "heading", text: "Your grade is in" },
        {
          type: "panel",
          rows: [
            { label: "Assignment", value: "{{assignment_name}}" },
            { label: "Course", value: "{{course_name}}" },
            { label: "Grade", value: "{{grade}}" },
            { label: "Class average", value: "{{class_average}}" },
          ],
        },
        { type: "heading", text: "Instructor feedback", size: "md" },
        { type: "quote", text: "{{feedback}}", author: "{{instructor_name}}" },
        { type: "button", label: "View full feedback", href: "{{grade_url}}" },
      ],
    },
    {
      key: "certificate-issued",
      name: "Certificate Issued",
      description: "Completion certificate with a shareable credential link.",
      category: "lifecycle",
      subject: "You completed {{course_name}} 🎉",
      preheader: "Your certificate is ready to download and share.",
      blocks: [
        { type: "heading", text: "Congratulations, {{first_name}}" },
        {
          type: "image",
          src: "{{certificate_preview_url}}",
          alt: "Certificate of completion for {{course_name}}",
          widthRatio: 0.7,
          align: "center",
          radius: true,
        },
        {
          type: "text",
          text: "You've completed <strong>{{course_name}}</strong> with a final grade of {{final_grade}}. Your certificate is ready.",
        },
        {
          type: "panel",
          rows: [
            { label: "Course", value: "{{course_name}}" },
            { label: "Completed", value: "{{completion_date}}" },
            { label: "Credential ID", value: "{{credential_id}}" },
          ],
        },
        { type: "button", label: "Download certificate", href: "{{certificate_url}}" },
        {
          type: "text",
          text: 'Add it to your LinkedIn profile or share the <a href="{{credential_url}}" style="color:inherit;">public credential page</a>.',
          muted: true,
        },
      ],
    },
    {
      key: "class-cancelled",
      name: "Class Cancelled",
      description: "Schedule change notice with the replacement session.",
      category: "operational",
      subject: "{{class_name}} on {{class_date}} is cancelled",
      preheader: "Rescheduled to {{new_date}}.",
      blocks: [
        { type: "heading", text: "{{class_name}} is cancelled" },
        {
          type: "text",
          text: "The session scheduled for {{class_date}} at {{class_time}} won't go ahead. Reason: {{reason}}.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Rescheduled",
          text: "The replacement session is on <strong>{{new_date}} at {{new_time}}</strong>, same link.",
        },
        { type: "button", label: "Update my calendar", href: "{{calendar_url}}" },
      ],
    },
    {
      key: "new-course-available",
      name: "New Course Available",
      description: "Catalogue announcement targeted at past learners.",
      category: "marketing",
      subject: "New course: {{course_name}}",
      preheader: "From {{instructor_name}} — enrolment is open.",
      blocks: [
        { type: "heading", text: "{{course_name}} is now open" },
        {
          type: "image",
          src: "{{course_image_url}}",
          alt: "{{course_name}}",
          radius: true,
        },
        { type: "text", text: "{{course_summary}}" },
        {
          type: "list",
          items: ["{{outcome_1}}", "{{outcome_2}}", "{{outcome_3}}"],
        },
        {
          type: "panel",
          rows: [
            { label: "Level", value: "{{level}}" },
            { label: "Length", value: "{{lesson_count}} lessons · {{total_duration}}" },
            { label: "Price", value: "{{price}}" },
          ],
        },
        { type: "button", label: "Enrol now", href: "{{course_url}}" },
      ],
    },
    {
      key: "course-expiring",
      name: "Access Expiring",
      description: "Warns that course access lapses and offers renewal.",
      category: "lifecycle",
      subject: "Your access to {{course_name}} ends in {{days_left}} days",
      preheader: "Finish the last {{lessons_remaining}} lessons or extend access.",
      blocks: [
        { type: "heading", text: "{{days_left}} days of access left" },
        {
          type: "text",
          text: "Your access to <strong>{{course_name}}</strong> ends on {{expiry_date}}. You have {{lessons_remaining}} lessons still to go.",
        },
        { type: "button", label: "Continue learning", href: "{{resume_url}}" },
        { type: "divider" },
        {
          type: "text",
          text: "Need longer? Extending keeps your notes, progress and certificate eligibility intact.",
          muted: true,
        },
        { type: "button", label: "Extend access", href: "{{renew_url}}", variant: "outline" },
      ],
    },
    {
      key: "parent-progress-report",
      name: "Progress Report",
      description: "Periodic summary for a parent or manager.",
      category: "operational",
      subject: "{{student_name}}'s progress report",
      preheader: "{{period}} summary — attendance, grades and next steps.",
      blocks: [
        { type: "heading", text: "{{student_name}} · {{period}}" },
        {
          type: "metrics",
          items: [
            { label: "Attendance", value: "{{attendance_rate}}" },
            { label: "Average grade", value: "{{average_grade}}" },
            { label: "Assignments done", value: "{{assignments_completed}}" },
          ],
        },
        { type: "heading", text: "Teacher's notes", size: "md" },
        { type: "text", text: "{{teacher_notes}}" },
        { type: "heading", text: "Focus next term", size: "md" },
        { type: "list", items: ["{{focus_1}}", "{{focus_2}}"] },
        { type: "button", label: "View full report", href: "{{report_url}}" },
      ],
    },
  ],
};
