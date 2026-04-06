// Users domain strings — externalized for i18n and consistency

export const usersTextMaps = {
  // ─── Page ────────────────────────────────────────────────────────────────
  pageTitle: 'User Management',
  pageDescription: 'Manage team members, roles, and account access.',

  // ─── Table columns ────────────────────────────────────────────────────────
  columnUser: 'User',
  columnEmail: 'Email',
  columnRole: 'Role',
  columnStatus: 'Status',
  columnActions: 'Actions',
  columnJoined: 'Joined',

  // ─── Filter bar ───────────────────────────────────────────────────────────
  searchPlaceholder: 'Search by name or email...',
  filterRole: 'Filter by role',
  filterStatus: 'Filter by status',
  allRoles: 'All Roles',
  allStatuses: 'All Statuses',

  // ─── Role labels ──────────────────────────────────────────────────────────
  roleAdmin: 'Admin',
  roleDesigner: 'Designer',
  roleProducer: 'Producer',
  roleQc: 'QC',
  roleClient: 'Client',

  // ─── Status labels ────────────────────────────────────────────────────────
  statusActive: 'Active',
  statusInactive: 'Inactive',

  // ─── Actions ─────────────────────────────────────────────────────────────
  inviteUser: 'Invite User',
  changeRole: 'Change Role',
  deactivate: 'Deactivate',
  reactivate: 'Reactivate',
  openMenu: 'Open actions menu',

  // ─── Invite dialog ────────────────────────────────────────────────────────
  inviteDialogTitle: 'Invite User',
  inviteDialogDescription: 'Send an invitation to add a new team member.',
  inviteDialogEmail: 'Email address',
  inviteDialogEmailPlaceholder: 'user@example.com',
  inviteDialogName: 'Full name',
  inviteDialogNamePlaceholder: 'Jane Doe',
  inviteDialogRole: 'Role',
  inviteDialogSelectRole: 'Select a role',
  inviteDialogCancel: 'Cancel',
  inviteDialogSubmit: 'Send Invitation',
  inviteDialogSubmitting: 'Sending...',

  // ─── Change role dialog ───────────────────────────────────────────────────
  changeRoleDialogTitle: 'Change Role',
  changeRoleDialogDescription: 'Update the role for this team member.',
  changeRoleDialogCurrentRole: 'Current role',
  changeRoleDialogNewRole: 'New role',
  changeRoleDialogSelectRole: 'Select a role',
  changeRoleDialogCancel: 'Cancel',
  changeRoleDialogSubmit: 'Update Role',
  changeRoleDialogSubmitting: 'Updating...',

  // ─── Deactivate confirmation ──────────────────────────────────────────────
  deactivateDialogTitle: 'Deactivate User',
  deactivateDialogDescription: (name: string) =>
    `Are you sure you want to deactivate ${name}? They will lose access to the platform immediately.`,
  deactivateDialogCancel: 'Cancel',
  deactivateDialogConfirm: 'Deactivate',
  deactivateDialogConfirming: 'Deactivating...',

  // ─── Empty / error states ─────────────────────────────────────────────────
  noUsersTitle: 'No users found',
  noUsersDescription: 'Invite team members to get started.',
  errorLoad: 'Failed to load users. Please try again.',
  errorInvite: 'Failed to send invitation. Please try again.',
  errorUpdateRole: 'Failed to update role. Please try again.',
  errorDeactivate: 'Failed to deactivate user. Please try again.',
  errorReactivate: 'Failed to reactivate user. Please try again.',

  // ─── Reactivate confirmation ─────────────────────────────────────────────
  reactivateDialogTitle: 'Reactivate User',
  reactivateDialogDescription: (name: string) =>
    `Are you sure you want to reactivate ${name}? They will regain access to the platform.`,
  reactivateDialogCancel: 'Cancel',
  reactivateDialogConfirm: 'Reactivate',
  reactivateDialogConfirming: 'Reactivating...',

  // ─── Credentials display (after invite) ───────────────────────────────────
  credentialsTitle: 'User Created',
  credentialsDescription:
    'Share these credentials with the new user. This is the only time the temporary password will be shown.',
  credentialsPassword: 'Temporary password',
  credentialsWarning:
    'Make sure to copy and securely share these credentials. The password cannot be recovered after closing this dialog.',
  credentialsCopy: 'Copy credentials',
  credentialsCopied: 'Copied!',
  credentialsDone: 'Done',

  // ─── Success toasts ───────────────────────────────────────────────────────
  invitationSent: 'User invited successfully.',
  roleUpdated: 'Role updated successfully.',
  userDeactivated: 'User deactivated successfully.',
  userReactivated: 'User reactivated successfully.',

  // ─── Access denied ────────────────────────────────────────────────────────
  accessDeniedTitle: 'Access Denied',
  accessDeniedDescription:
    'You need administrator privileges to access this page.',

  // ─── Profile (legacy — kept for backward compatibility) ───────────────────
  userProfile: 'User Profile',
  myProfile: 'My Profile',
  editProfile: 'Edit Profile',
  updateProfile: 'Update Profile',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phone: 'Phone Number',
  department: 'Department',
  bio: 'Bio',
  avatar: 'Avatar',
  changeAvatar: 'Change Avatar',

  // ─── Teams (legacy) ───────────────────────────────────────────────────────
  teams: 'Teams',
  myTeams: 'My Teams',
  createTeam: 'Create Team',
  teamName: 'Team Name',
  teamDescription: 'Team Description',
  teamMembers: 'Team Members',
  memberCount: 'Members',
  owner: 'Owner',
  addMember: 'Add Member',
  removeMember: 'Remove Member',
  leaveTeam: 'Leave Team',

  // ─── Invitations (legacy) ─────────────────────────────────────────────────
  invitations: 'Invitations',
  sendInvitation: 'Send Invitation',
  inviteEmail: 'Email to Invite',
  inviteRole: 'Role',
  pendingInvitations: 'Pending Invitations',
  acceptInvitation: 'Accept Invitation',
  declineInvitation: 'Decline Invitation',
  invitationExpired: 'Invitation Expired',

  // ─── Preferences (legacy) ─────────────────────────────────────────────────
  preferences: 'Preferences',
  theme: 'Theme',
  themeDark: 'Dark',
  themeLight: 'Light',
  themeSystem: 'System',
  language: 'Language',
  timezone: 'Timezone',
  notifications: 'Notifications',
  emailNotifications: 'Email Notifications',
  slackNotifications: 'Slack Notifications',

  // ─── Messages (legacy) ────────────────────────────────────────────────────
  profileUpdated: 'Profile updated successfully',
  teamCreated: 'Team created successfully',
  memberAdded: 'Member added to team',
  preferencesUpdated: 'Preferences updated'
} as const;
