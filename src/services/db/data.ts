export enum DB {
  // CONNECTION_STRING = `mongodb://localhost/hospital`,
  CONNECTION_STRING = `mongodb+srv://hospital:hospital@cluster0.kzgkl61.mongodb.net/?retryWrites=true&w=majority`,
  SUCCESS_MESSAGE = "Connected to mongoDb",
  ERROR_MESSAGE = "\nUnable to connect to mongodb.\n\nFollowing error occurred:\n",
}
