export const mockUser = {
  id: "12315512",
  email: "danny@devito.com",
  password: "abc123",
  admin: false,
  organizer: true,
  timestamp: Date.now(),
  lastUpdated: Date.now(),
  firstSubmitted: 32503680000000.0,
  verified: true,
  salt: "123abc",

  /**
   * User Profile.
   *
   * This is the only part of the user that the user can edit.
   * Profile validation will exist here.
   */
  profile: {
    // Personal Info
    firstName: "Danny",
    lastName: "Devito",
    gender: "M",
    phoneNumber: "555-123-4567",
    shirtSize: "XS",
    organization: "??",

    // emergency contact
    emergencyContact: {
      name: "mommy",
      relationship: "mother",
      cellNumber: "555-420-1337",
      workNumber: "555-420-1337",
    },

    // School Information
    school: "Monsters U",
    schoolYear: "Sophomore",
    major: "Basket Weaving",
    minor: "CS",

    // Additional Logistics
    dietaryRestrictions: [],
    needsReimbursement: false,
    reimbursementOrigin: "none",

    //Bitcamp
    amtHackathons: "0",
    whyBitcamp: "it cool",
    buildBitcamp: "???",
    workshops: ["none"],

    // Professional
    // resume uses dropbox form
    interestedIn: "full-time",
    github: "danny.devito.github",
    devpost: "danny.devito.devpost",
    website: "danny.devito",

    //Legal
    mlhCOC: true,
    mlhTAC: true,
    bitcampWaiver: true,

    // Additional
    additional: "",
  },

  /**
   * Confirmation information
   * Extension of the user profile, but can only be edited after acceptance.
   */
  confirmation: {
    confirmationAdditional: "test"
  },

  status: {
    completedProfile: true,
    admitted: true,
    admittedBy: "fox@mulder.com",
    confirmed: true,
    declined: false,
    waitlisted: false,
    didNotConfirm: false,
    checkedIn: true,
    checkInTime: 200,
    confirmBy: 200,
    reimbursementGiven: false
  },

  /**
   * Passwordless login
   * Code and Expiration time
   */
  loginCode: "123456",

  loginCodeExpiration: Date.now(),

  favoritedEvents: [20056, 20074, 20082],

  // TODO: Remove after Bitcamp 2019
  favoritedFirebaseEvents: [20056, 20074, 20082],

  reimbursementLimit: 10
};
