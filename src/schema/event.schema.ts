type Event {
  id: ID!
  title: String!
  description: String
  date: DateTime
  time: String
  location: String
  coverImage: String
  createdBy: User!
  organizers: [User!]!
  departments: [String!]!
  attendees: [User!]!
  isApproved: Boolean!
}

extend type Query {
  getAllEvents: [Event!]!
  getMyEvents: [Event!]!
  getEvent(id: ID!): Event
}

extend type Mutation {
  createEvent(input: EventInput!): Event!
  joinEvent(eventId: ID!): Event!
  deleteEvent(id: ID!): String!
  approveEvent(id: ID!): Event!
}

input EventInput {
  title: String!
  description: String
  date: DateTime
  time: String
  location: String
  coverImage: String
  departments: [String!]!
  organizers: [ID!]!
}