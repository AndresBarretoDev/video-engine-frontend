// Auth domain strings - externalized for i18n and consistency

export const authTextMaps = {
  // Login page
  loginTitle: 'Sign In to OP Video Engine',
  loginSubtitle: 'Enter your credentials to access your account',
  emailLabel: 'Email Address',
  emailPlaceholder: 'your@email.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  rememberMe: 'Remember me',
  loginButton: 'Sign In',
  forgotPassword: 'Forgot password?',

  // Error messages
  invalidCredentials: 'Invalid email or password',
  sessionExpired: 'Your session has expired. Please sign in again',
  unauthorizedAccess: 'You do not have permission to access this resource',
  userNotFound: 'No account found with this email',
  serverError: 'An error occurred. Please try again later',

  // Session/Auth status
  loggingIn: 'Signing in...',
  authenticating: 'Authenticating...',
  loadingSession: 'Loading session...',
  sessionValid: 'Session is valid',

  // Roles
  roleAdmin: 'Administrator',
  roleDesigner: 'Designer',
  roleProducer: 'Producer',
  roleQC: 'Quality Control',
  roleClient: 'Client'
} as const;
